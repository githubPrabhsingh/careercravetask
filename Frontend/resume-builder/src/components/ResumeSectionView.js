import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import {
    UilBars,
    UilInfoCircle,
    UilCheck,
    UilTimes,
    UilPen,
} from "@iconscout/react-unicons";

import Switch from "react-switch";
import "react-tippy/dist/tippy.css";
//Import the react-tippy CSS

import "./ResumeSectionView.css";

import { Tooltip } from "react-tippy";

import { Puff } from "react-loader-spinner";

const data = [
  {
    id: 1,
    name: "Profile Summary",
    enabled: true,
    description: "Add Summary here...",
    isEditing: false,
  },
  {
    id: 2,
    name: "Academic and Cocurricular Achievements",
    enabled: true,
    description: "Add your educational background here...",
    isEditing: false,
  },
  {
    id: 3,
    name: "Summer Internship Experience",
    enabled: true,
    description: "List Internship Experience here...",
    isEditing: false,
  },
  {
    id: 4,
    name: "Work Experience",
    enabled: true,
    description: "List your work experience here...",
    isEditing: false,
  },
  {
    id: 5,
    name: "Projects",
    enabled: false,
    description:
      "Elaborate your projects which you have built or worked upon..",
    isEditing: false,
  },
  {
    id: 6,
    name: "Certifications",
    enabled: false,
    description: "Details of your Certificates...",
    isEditing: false,
  },
  {
    id: 7,
    name: "Leadership Positions",
    enabled: true,
    description: "Details of your leadership positions over the years...",
    isEditing: false,
  },
  {
    id: 8,
    name: "Extracurricular",
    enabled: true,
    description: "Details of your extracurricular activities",
    isEditing: false,
  },
  {
    id: 9,
    name: "Education",
    enabled: true,
    description: "Details of your education here..",
    isEditing: false,
  },
];

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const[removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

const grid = 8;

const getListStyle = (isDraggingOver) => (
    {
        background: isDraggingOver ? "lightgray" : "transparent",
        padding: grid,
    }
);

const ResumeSectionView = () => {
  const [items, setItems] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getItemStyle = (isDragging, draggableStyle, index) => ({
    userSelect: "none",
    background:
      activeIndex !== null && activeIndex !== index
        ? "lightgray"
        : //Color for inactive tiles
        isDragging
        ? "#ffffff"
        : //Color for dragging tile
          "transparent",
    //Default color for other tiles
    ...draggableStyle,
  });

  useEffect(() => {
    const storedItems = localStorage.getItem("appItems");
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    } else {
      setItems(data);
    }
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const reorderedItems = reorder(
      items,
      result.source.index,
      result.destination.index
    );

    setItems(reorderedItems);
  };

  const handleSectionNameChange = (index, newName) => {
    const updatedSections = [...items];
    updatedSections[index].name = newName;
    setItems(updatedSections);
  };

  const handleSectionToggle = (index) => {
    const updatedSections = [...items];
    updatedSections[index].enabled = !updatedSections[index].enabled;
    setItems(updatedSections);
  };

  const handleEditClick = (index) => {
    setActiveIndex(index);
    const updatedSections = [...items];
    updatedSections.forEach((section, i) => {
      section.isEditing = i === index;
    });
    setItems(updatedSections);
  };

  const handleSaveClick = (index) => {
    setActiveIndex(null);
    const updatedSections = [...items];
    updatedSections[index].isEditing = false;
    setItems(updatedSections);
  };
  const handleSaveAndNext = () => {
    setIsLoading(true); // Show loading animation

    setTimeout(() => {
      localStorage.setItem("appItems", JSON.stringify(items));
      setIsLoading(false); // Hide loading animation
    }, 2000); // Simulating a delay of 2 seconds for demonstration purposes
  };

  return (
    <div className="main_content">
      <div className="container">
        <div className="header-text">
          <p>Select your sections</p>
        </div>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      key={item.id}
                      className="section-tile"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style,
                        index
                      )}
                    >
                      <div className="firsthalf">
                        <div
                          className="drag-handle"
                          {...provided.dragHandleProps}
                        >
                          <UilBars className="drag-icon" />
                        </div>

                        <Tooltip
                          title={item.description}
                          position="bottom"
                          trigger="mouseenter"
                          animation="scale"
                          arrow={true}
                          arrowSize="small"
                          className="custom-tooltip"
                        >
                          <div className="info-circle">
                            <UilInfoCircle />
                          </div>
                        </Tooltip>

                        {item.isEditing ? (
                          <input
                            className="title"
                            type="text"
                            value={item.name}
                            onChange={(e) =>
                              handleSectionNameChange(index, e.target.value)
                            }
                            autoFocus
                          />
                        ) : (
                          <div className="title">{item.name}</div>
                        )}
                      </div>

                      <div className="secondhalf">
                        {item.isEditing ? (
                          <div className="edit-container">
                            <button
                              className="save"
                              onClick={() => handleSaveClick(index)}
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <div className="edit-container">
                            <UilPen
                              className="edit"
                              onClick={() => handleEditClick(index)}
                            />
                          </div>
                        )}

                        <div className="switchcontainer">
                          <label>
                            <Switch
                              id="switch"
                              className={
                                item.enabled ? "switch-on" : "switch-off"
                              }
                              checked={item.enabled}
                              handleDiameter={18}
                              height={24}
                              width={39}
                              onChange={() => handleSectionToggle(index)}
                              offColor="#E6E6E6"
                              offHandleColor="#8B8B8B"
                              checkedIcon={false}
                              checkedHandleIcon={<UilCheck className="check" />}
                              uncheckedHandleIcon={
                                <UilTimes className="cross" />
                              }
                              uncheckedIcon={false}
                              onColor="#D0BCFF"
                              onHandleColor="#381e72"
                            />

                            <span className="slider round" />
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="btn">
        <button className="btn-btn" onClick={handleSaveAndNext}>
          {" "}
          <div className="btn-content">
            {" "}
            {isLoading ? ( // Render loading animation if isLoading is true
              <Puff
                className="loader"
                height="30"
                width="30"
                // radius={1}
                color="#ffffff"
                ariaLabel="puff-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
              />
            ) : (
              "Save and Next"
            )}
          </div>
        </button>
      </div>
    </div>
  );
};

export default ResumeSectionView;
