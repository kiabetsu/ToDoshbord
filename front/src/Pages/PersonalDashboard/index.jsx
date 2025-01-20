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
import { useDroppable } from '@dnd-kit/core';

import styles from './style.module.scss';
import { Modal, ModalRefactored } from '../../components/Modal';
import { TaskModal } from '../../components/TaskModal';
import { Header } from '../../components/Header';
import { ColumnBlockRefactor } from '../../components/ColumnBlock';
import { TaskBlock } from '../../components/TaskBlock';
import { setOrderIndex } from '../../redux/taskSlice';
import { AlertModal } from '../../components/AlertModal';

export const PersonalDashboard = () => {
  const { statuses, modal, tasks, filteredTasks } = useSelector((state) => state.tasks);
  // eslint-disable-next-line no-undef
  const dispatch = useDispatch();

  const tasksIds = tasks.map((obj) => obj.id);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
    // useSensor(KeyboardSensor, {
    //   coordinateGetter: sortableKeyboardCoordinates,
    // }),
  );

  // const { setNodeRef } = useDroppable({
  //   id,
  // });

  const [activeTask, setActiveTask] = React.useState(null);

  const onDragStart = (event) => {
    //   if (event.active.data?.current?.type === 'task') {
    //     const dragElem = {
    //       id: event.active.id,
    //       order_index: event.active.data.current.order_index,
    //       summary: event.active.data.current.summary,
    //       description: event.active.data.current.description,
    //       due_date: {
    //         date: event.active.data.current.due_date.date,
    //         date_format: event.active.data.current.due_date.date_format,
    //       },
    //       status: event.active.data.current.status,
    //       attachments: [],
    //     };
    //     setActiveTask(dragElem);
    //   }
  };

  const onDragEnd = (event) => {
    setActiveTask(null);

    //   const { active, over } = event;
    //   if (!over) return;

    //   // const activeTaskId = active.id;
    //   // const overTaskId = over.id;

    //   // if (activeTaskId !== overTaskId) {
    //   // }
  };

  const onDragOver = (event) => {
    const { active, over } = event;

    const activeOrder_index = active.data.current.order_index;
    const overOrder_index = over.data.current.order_index;

    // if (!over) return;

    // const activeTaskId = active.id;
    // const overTaskId = over.id;

    // if (activeTaskId !== overTaskId) {
    //   const isActiveTask = active.data.current?.type === 'task';
    //   const isOverTask = over.data.current?.type === 'task';

    //   if (isActiveTask && isOverTask) {
    //     dispatch(
    //       setOrderIndex({
    //         active: active,
    //         over: over,
    //       }),
    //     );
    //   }
    // }
  };

  return (
    <>
      {/* {modal.isOpen && <Modal id={modal.id} />} */}
      {/* <Modal id={modal.id} /> */}
      {/* <AlertModal /> */}

      <TaskModal />
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
                <SortableContext items={tasksIds} strategy={verticalListSortingStrategy}>
                  <div
                    // ref={setNodeRef}
                    className={styles.tasksList}>
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
          {createPortal(
            <DragOverlay>{activeTask && <TaskBlock {...activeTask} />}</DragOverlay>,
            document.body,
          )}
        </DndContext>
      </div>
    </>
  );
};
