// src/components/MealPlanner.jsx (FINAL ROBUST VERSION)

import React, { useState, useEffect, useCallback } from 'react'; 
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import { getMealPlan, scheduleMeal, unscheduleMeal, updateScheduledMeal } from '../api/api'; 
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import './MealPlanner.css';

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);

const MealPlanner = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. Fetch API data ---
  const fetchMealPlan = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMealPlan();
      const calendarEvents = data.map(plan => {
        const start = moment(plan.scheduledDate).toDate();
        const end = moment(start).add(1, 'hour').toDate(); 

        return {
          id: plan._id, 
          recipeId: plan.recipe ? plan.recipe._id : 'unknown', 
          title: plan.recipe ? plan.recipe.title : 'Unknown Recipe', 
          start, 
          end, 
          allDay: false,
          resource: plan, 
        };
      });
      setEvents(calendarEvents);
    } catch (error) {
      console.error("Error fetching meal plan:", error); 
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []); 

  useEffect(() => {
    fetchMealPlan();
  }, [fetchMealPlan]);

  // --- 2. Drag external recipe into calendar ---
  const dragFromOutsideItem = useCallback(() => {
    try {
      const payload = window?.draggedRecipe; // convention: set on drag start in recipe list
      if (!payload) return null;
      const [recipeId, title] = payload.split('::');
      return { recipeId, title };
    } catch {
      return null;
    }
  }, []);

  const handleDropFromOutside = async ({ start }) => {
    const item = dragFromOutsideItem();
    if (!item) return;

    try {
      const { recipeId, title } = item;
      const planData = { recipeId, scheduledDate: start.toISOString(), mealType: 'Dinner' };
      await scheduleMeal(planData);
      await fetchMealPlan(); 
      alert(`"${title}" scheduled for ${moment(start).format('MMM Do, h:mm a')}`);
    } catch (error) { 
      alert('Failed to schedule meal. Check API server status.');
      console.error('Error scheduling meal via API:', error);
    }
  };

  // --- 3. Move/resize events ---
  const handleEventMove = async ({ event, start, end }) => {
    const mealPlanId = event.id;

    // Optimistic update
    setEvents(prev => prev.map(e => 
      e.id === mealPlanId ? { ...e, start, end } : e
    ));

    if (mealPlanId.startsWith('note-')) {
      // Local note handling
      const action = prompt(
        `Note "${event.title}" moved/resized.\nEnter new title or click OK to keep:`,
        event.title
      );
      if (action !== null && action.trim() !== event.title) {
        setEvents(prev => prev.map(e => 
          e.id === mealPlanId ? { ...e, title: action.trim() } : e
        ));
      }
      return;
    }

    try {
      const updateData = { scheduledDate: start.toISOString() };
      await updateScheduledMeal(mealPlanId, updateData);
    } catch (error) {
      await fetchMealPlan(); // revert
      alert('Failed to move meal. Reverting.');
      console.error('Error moving scheduled meal:', error);
    }
  };

  // --- 4. Add note ---
  const handleSelectSlot = ({ start, end }) => {
    const newTitle = prompt('Enter a note for this time slot:');
    if (newTitle && newTitle.trim()) {
      setEvents(prev => [
        ...prev,
        {
          id: `note-${Date.now()}`,
          title: newTitle.trim(),
          start,
          end,
          allDay: moment(end).diff(moment(start), 'hours') >= 23,
        }
      ]);
    }
  };

  // --- 5. Custom renderer ---
  const EventComponent = ({ event }) => {
    const isNote = event.id.startsWith('note-');
    return (
      <div 
        className={`calendar-event-content ${isNote ? 'calendar-note' : 'calendar-recipe'}`}
        title={event.title}
      >
        <strong>{event.title}</strong>
      </div>
    );
  };

  // --- 6. Double click edit/delete ---
  const handleEventDoubleClick = async (event) => {
    if (event.id.startsWith('note-')) {
      if (window.confirm(`Delete note "${event.title}"?`)) { 
        setEvents(prev => prev.filter(e => e.id !== event.id));
      } else {
        const newTitle = prompt('Edit note title:', event.title);
        if (newTitle && newTitle.trim() !== event.title) {
          setEvents(prev => prev.map(e => 
            e.id === event.id ? { ...e, title: newTitle.trim() } : e
          ));
        }
      }
      return; 
    }

    if (!window.confirm(`Remove "${event.title}" from meal plan?`)) return;

    try {
      await unscheduleMeal(event.id);
      setEvents(prev => prev.filter(e => e.id !== event.id));
    } catch (error) {
      alert('Failed to remove meal.');
      console.error('Error unscheduling meal:', error);
    }
  };

  if (loading) return <div className="loading-planner">Loading Planner...</div>;

  return (
    <div className="planner-container">
      <h3>
        Weekly Meal Planner 
        <small> (Double-click to unschedule/edit, drag to move/resize)</small>
      </h3>
      <DragAndDropCalendar 
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        draggableAccessor={() => true} 

        // Handlers
        onSelectSlot={handleSelectSlot} 
        onDropFromOutside={handleDropFromOutside}
        onEventDrop={handleEventMove} 
        onEventResize={handleEventMove} 
        onDoubleClickEvent={handleEventDoubleClick}
        dragFromOutsideItem={dragFromOutsideItem}
        
        // Other Props
        style={{ height: 600 }}
        defaultView="week"
        popup
        components={{ event: EventComponent }}
      />
    </div>
  );
};

export default MealPlanner;
