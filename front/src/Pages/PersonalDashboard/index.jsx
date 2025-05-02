import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import styles from './style.module.scss';

import { TaskModal } from '../../components/TaskModal';
import { Header } from '../../components/Header';
import { ColumnBlockRefactor } from '../../components/ColumnBlock';
import { TaskBlock } from '../../components/TaskBlock';
import { dndChange, setDndUpdate, addAlert } from '../../redux/taskSlice';

export const PersonalDashboard = () => {
  const { statuses, tasks } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

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
    const activeIndex = tasks.findIndex((item) => item.id === active.id);
    const overIndex = tasks.findIndex((item) => item.id === over.id);

    if (activeIndex === overIndex) return;

    if (isSameColumn) {
      newItems = arrayMove(tasks, activeIndex, overIndex);

      newItems = newItems.map((item, index) => {
        return {
          ...item,
          order_index: item.status === activeItem.status ? index : item.order_index,
        };
      });
    } else {
      // if (activeIndex < overIndex) {
      //   newItems = arrayMove(tasks, activeIndex, overIndex);
      // }
      newItems = arrayMove(tasks, activeIndex, overIndex);

      newItems[overIndex] = {
        ...newItems[overIndex],
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
    dispatch(dndChange(tasks));
    setActiveId(null);
    setOverId(null);
  };

  const activeItem = tasks.find((item) => item.id === activeId);

  return (
    <>
      <TaskModal />
      <Header />
      <div className={styles.main}>
        {/* <button onClick={() => dispatch(getTasks())}>check rerenders</button> */}
        <button onClick={() => dispatch(addAlert())}> add alert</button>
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
                  items={tasks.filter((task) => task.status === i).map((task) => task.id)}
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
