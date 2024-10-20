import { useSelector } from 'react-redux';
import './App.css';
import { ColumnBlock } from './components/ColumnBlock';
import { Header } from './components/Header';
import { Modal } from './components/Modal';
import { setModalIsOpen } from './redux/taskSlice';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'


function App() {

  // const {test} = useSelector((state) => state.taskSlice)

  // console.log(test)

  const {statuses, modal, idDraggingComponent} = useSelector((state) => state.tasks)

  // console.log(tasks, status);

  // const test = useSelector((state) => state.tasksTest.tasks)


  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        {modal.isOpen && <Modal id={modal.id} /> }
        <Header />
        <div className="main">
          <h2>Road map</h2>
          <div className="content">
            {statuses.map((value, i) => (
              <ColumnBlock key={i} title={value} status={i}/>
            ))}
          </div>
        </div>
      <h1>ACTIVNA HAHUI - {idDraggingComponent}</h1>
      </div>

    </DndProvider>
  );
}

export default App;
