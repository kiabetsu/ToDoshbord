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
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';

import styles from './style.module.scss';
import { Modal } from '../../components/Modal';
import { Header } from '../../components/Header';
import { ColumnBlockRefactor } from '../../components/ColumnBlock';
import { TaskBlock } from '../../components/TaskBlock';
import { setOrderIndex } from '../../redux/taskSlice';

export const PersonalDashboard = () => {
  const { statuses, modal, tasks, filteredTasks } = useSelector((state) => state.tasks);
  // eslint-disable-next-line no-undef
  const dispatch = useDispatch();

  console.log('filteredTasks', filteredTasks);

  const tasksIds =
    tasks === filteredTasks ? tasks.map((obj) => obj.id) : filteredTasks.map((obj) => obj.id);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
    // useSensor(KeyboardSensor, {
    //   coordinateGetter: sortableKeyboardCoordinates,
    // }),
  );

  const [activeTask, setActiveTask] = React.useState(null);

  const onDragStart = (event) => {
    console.log('tinu', event.active);
    if (event.active.data?.current?.type === 'task') {
      const dragElem = {
        id: event.active.id,
        order_index: event.active.data.current.order_index,
        summery: event.active.data.current.summery,
        description: event.active.data.current.description,
        due_date: {
          date: event.active.data.current.due_date.date,
          date_format: event.active.data.current.due_date.date_format,
        },
        status: event.active.data.current.status,
        attachments: [],
      };
      setActiveTask(dragElem);
    }
  };

  const onDragEnd = (event) => {
    setActiveTask(null);
    console.log('TASKS', tasks);

    //   const { active, over } = event;
    //   console.log('otpustil active', active);
    //   console.log('otpustil over', over);
    //   if (!over) return;

    //   // const activeTaskId = active.id;
    //   // const overTaskId = over.id;

    //   // if (activeTaskId !== overTaskId) {
    //   // }
  };

  const onDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeTaskId = active.id;
    const overTaskId = over.id;

    if (activeTaskId !== overTaskId) {
      const isActiveTask = active.data.current?.type === 'task';
      const isOverTask = over.data.current?.type === 'task';

      if (isActiveTask && isOverTask) {
        dispatch(
          setOrderIndex({
            active: active,
            over: over,
          }),
        );
      }
    }
  };

  return (
    <>
      {modal.isOpen && <Modal id={modal.id} />}
      <Header />
      <div className={styles.main}>
        <h2>Road map</h2>
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}>
          <div className={styles.content}>
            {statuses.map((statusTitle, i) => (
              <ColumnBlockRefactor key={i} statusTitle={statusTitle}>
                <div className={styles.tasksList}>
                  <SortableContext items={tasksIds}>
                    {filteredTasks
                      .filter((task) => task.status === i)
                      .sort((a, b) => a.order_index - b.order_index)
                      .map((obj) => (
                        <TaskBlock key={obj.id} {...obj} />
                      ))}
                  </SortableContext>
                </div>
              </ColumnBlockRefactor>
            ))}
          </div>
          {createPortal(
            <DragOverlay>{activeTask && <TaskBlock {...activeTask} />}</DragOverlay>,
            document.body,
          )}
        </DndContext>
      </div>
    </>
  );
};
