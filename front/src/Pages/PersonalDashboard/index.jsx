import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  activationConstraint,
  useDndMonitor,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';

import styles from './style.module.scss';

import { TaskModal } from '../../components/TaskModal';
import { Header } from '../../components/Header';
import { ColumnBlockRefactor } from '../../components/ColumnBlock';
import { TaskBlock } from '../../components/TaskBlock';
import { setDndUpdate } from '../../redux/taskSlice';

export const PersonalDashboard = () => {
  const { statuses, tasks, filteredTasks } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  const tasksIds =
    tasks === filteredTasks ? tasks.map((obj) => obj.id) : filteredTasks.map((obj) => obj.id);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 10 } }));

  const [activeId, setActiveId] = React.useState(null);
  const [overId, setOverId] = React.useState(null);

  const onDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const onDragOver = (event) => {
    setOverId(event.over?.id);
    const { active, over } = event;

    const activeItem = tasks.find((item) => item.id === active.id);
    const overItem = tasks.find((item) => item.id === over.id);

    const isSameColumn = activeItem.status === overItem.status;

    let newItems = [...tasks];

    const oldIndex = tasks.findIndex((item) => item.id === active.id);
    const newIndex = tasks.findIndex((item) => item.id === over.id);

    if (isSameColumn) {
      newItems = arrayMove(tasks, oldIndex, newIndex);

      newItems = newItems.map((item, index) => ({
        ...item,
        order_index: item.status === activeItem.status ? index : item.order_index,
      }));
    } else {
      newItems = arrayMove(tasks, oldIndex, newIndex);

      newItems[newIndex] = {
        ...newItems[newIndex],
        status: overItem.status,
        order_index: overItem.order_index,
      };

      newItems = newItems.map((item) => {
        if (item.status === activeItem.status && item.order_index > activeItem.order_index) {
          return { ...item, order_index: item.order_index - 1 };
        }
        return item;
      });

      newItems = newItems.map((item) => {
        if (item.status === overItem.status && item.order_index >= overItem.order_index) {
          return { ...item, order_index: item.order_index + 1 };
        }
        return item;
      });
    }
    dispatch(setDndUpdate(newItems));
  };

  const onDragEnd = (event) => {
    // setActiveTask(null);

    setActiveId(null); // Сбрасываем активный элемент
    setOverId(null); // Сбрасываем элемент, на который навели
  };

  const activeItem = tasks.find((item) => item.id === activeId);

  return (
    <>
      <TaskModal />
      <Header />
      <div className={styles.main}>
        <h2>Road map</h2>
        <DndContext
          collisionDetection={closestCenter}
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}>
          <div className={styles.content}>
            {statuses.map((statusTitle, i) => (
              <ColumnBlockRefactor key={i} statusTitle={statusTitle}>
                <SortableContext
                  items={tasks.filter((task) => task.status === i)}
                  strategy={verticalListSortingStrategy}>
                  <div className={styles.tasksList}>
                    {tasks
                      .filter((task) => task.status === i)
                      .sort((a, b) => a.order_index - b.order_index)
                      .map((obj) => (
                        <TaskBlock key={obj.id} {...obj} />
                      ))}
                  </div>
                </SortableContext>
              </ColumnBlockRefactor>
            ))}
          </div>

          <DragOverlay>{activeItem && <TaskBlock {...activeItem} />}</DragOverlay>
        </DndContext>
      </div>
    </>
  );
};
