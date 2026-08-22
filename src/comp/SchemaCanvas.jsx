import { useState, useEffect } from "react";

import ReactFlow, {
  useNodesState,
  useEdgesState,
  Background,
  Controls,
} from "reactflow";

import "reactflow/dist/style.css";
import TableNode from "./TableNode";

const nodeTypes = {
  table: TableNode,
};
// Automatic layout
function createAutomaticLayout(tables, relationships) {

  const tableIds =
    tables.map((table) => table.id);

  const positions = {};

  const visited = new Set();

    // Build connections
  
  const connections = {};


  for (const tableId of tableIds) {

    connections[tableId] = [];

  }


  for (const relationship of relationships) {

    if (!connections[relationship.source]) {

      connections[relationship.source] = [];

    }

    if (!connections[relationship.target]) {

      connections[relationship.target] = [];

    }


    connections[relationship.source].push(
      relationship.target
    );

    connections[relationship.target].push(
      relationship.source
    );

  }
  
  // Find connected components
  
  const components = [];

  for (const tableId of tableIds) {

    if (visited.has(tableId)) {
      continue;
    }


    const component = [];

    const queue = [tableId];

    visited.add(tableId);


    while (queue.length > 0) {

      const current =
        queue.shift();


      component.push(current);


      for (
        const connectedTable
        of connections[current]
      ) {

        if (!visited.has(connectedTable)) {

          visited.add(connectedTable);

          queue.push(connectedTable);

        }

      }

    }


    components.push(component);

  }


  
  // Separate connected and
  // disconnected tables
  

  const connectedComponents =
    components.filter(
      (component) =>
        component.length > 1
    );


  const disconnectedTables =
    components
      .filter(
        (component) =>
          component.length === 1
      )
      .map(
        (component) =>
          component[0]
      );


  
  // Layout connected components
  

  // here below: tighter table spacing

  const horizontalSpacing = 300;

  const verticalSpacing = 170;

  const componentSpacing = 80;

  const startX = 80;

  const startY = 100;


  let componentOffsetY = startY;


  for (
    const component
    of connectedComponents
  ) {

    const componentLevels = {};

    const componentVisited = new Set();


    const root =
      component[0];


    const queue = [
      {
        id: root,
        level: 0,
      },
    ];


    while (queue.length > 0) {

      const current =
        queue.shift();


      if (
        componentVisited.has(
          current.id
        )
      ) {
        continue;
      }


      componentVisited.add(
        current.id
      );


      componentLevels[current.id] =
        current.level;


      for (
        const connectedTable
        of connections[current.id]
      ) {

        if (
          component.includes(
            connectedTable
          ) &&
          !componentVisited.has(
            connectedTable
          )
        ) {

          queue.push({

            id: connectedTable,

            level:
              current.level + 1,

          });

        }

      }

    }


    
    // Group tables by level
    

    const levelsForComponent = {};


    for (
      const tableId
      of component
    ) {

      const level =
        componentLevels[tableId] ?? 0;


      if (
        !levelsForComponent[level]
      ) {

        levelsForComponent[level] = [];

      }


      levelsForComponent[level].push(
        tableId
      );

    }


    
    // Position tables
    

    let maximumTablesInLevel = 1;


    for (
      const level
      of Object.keys(
        levelsForComponent
      )
    ) {

      maximumTablesInLevel =
        Math.max(
          maximumTablesInLevel,
          levelsForComponent[level].length
        );

    }


    for (
      const level
      of Object.keys(
        levelsForComponent
      )
    ) {

      const tablesAtLevel =
        levelsForComponent[level];


      tablesAtLevel.forEach(
        (tableId, index) => {

          positions[tableId] = {

            x:
              startX +
              Number(level) *
              horizontalSpacing,

            y:
              componentOffsetY +
              index *
              verticalSpacing,

          };

        }
      );

    }


    componentOffsetY +=
      maximumTablesInLevel *
      verticalSpacing +
      componentSpacing;

  }


  
  // Disconnected tables
  

  // here below: disconnected tables
  // get their own separate row

  if (
    disconnectedTables.length > 0
  ) {

    const disconnectedY =
      componentOffsetY + 100;


    disconnectedTables.forEach(
      (tableId, index) => {

        positions[tableId] = {

          x:
            startX +
            index * horizontalSpacing,

          y:
            disconnectedY,

        };

      }
    );

  }


  return positions;

}



// Schema Canvas


function SchemaCanvas({ schema }) {

  const [selectedRelationship, setSelectedRelationship] =
    useState(null);

  const [selectedTable, setSelectedTable] =
    useState(null);

  const [hoveredRelationship, setHoveredRelationship] =
    useState(null);


  
  // Automatic positions
  

  const automaticPositions =
    createAutomaticLayout(
      schema.tables,
      schema.relationships
    );


  
  // Initial nodes
  

  const initialNodes =
    schema.tables.map((table) => ({

      id: table.id,

      position:
        automaticPositions[table.id] || {
          x: 100,
          y: 100,
        },

      data: {

        table,

        relationships:
          schema.relationships,

        selectedRelationship: null,

        selectedTable: null,

        onTableClick: (tableId) => {

          setSelectedTable(tableId);

          setSelectedRelationship(null);

        },

      },

      type: "table",

    }));


  
  // Initial edges
  

  const initialEdges =
    schema.relationships.map(
      (relationship) => ({

        id: relationship.id,

        source:
          relationship.source,

        target:
          relationship.target,

        sourceHandle:
          `${relationship.source}-${relationship.sourceColumn}-source`,

        targetHandle:
          `${relationship.target}-${relationship.targetColumn}-target`,

        type: "smoothstep",

      })
    );


  
  // React Flow state
  

  const [nodes, setNodes, onNodesChange] =
    useNodesState(initialNodes);

  const [edges, setEdges, onEdgesChange] =
    useEdgesState(initialEdges);


  
  // Update nodes when schema changes
  

  useEffect(() => {

    const newPositions =
      createAutomaticLayout(
        schema.tables,
        schema.relationships
      );


    const newNodes =
      schema.tables.map((table) => ({

        id: table.id,

        position:
          newPositions[table.id] || {
            x: 100,
            y: 100,
          },

        data: {

          table,

          relationships:
            schema.relationships,

          selectedRelationship,

          selectedTable,

          onTableClick: (tableId) => {

            setSelectedTable(tableId);

            setSelectedRelationship(null);

          },

        },

        type: "table",

      }));


    setNodes(newNodes);

  }, [
    schema,
    setNodes,
  ]);


  
  // Update table selection
  

  useEffect(() => {

    setNodes((currentNodes) =>

      currentNodes.map((node) => ({

        ...node,

        data: {

          ...node.data,

          selectedRelationship,

          selectedTable,

        },

      }))

    );

  }, [
    selectedRelationship,
    selectedTable,
    setNodes,
  ]);


  
  // Update edge appearance
  

  useEffect(() => {

    setEdges(

      schema.relationships.map(
        (relationship) => {

          const isSelected =
            selectedRelationship ===
            relationship.id;


          const isHovered =
            hoveredRelationship ===
            relationship.id;


          const tableIsSelected =
            selectedTable ===
              relationship.source ||
            selectedTable ===
              relationship.target;


          return {

            id: relationship.id,

            // here below: original
            // relationship direction

            source:
              relationship.source,

            target:
              relationship.target,

            sourceHandle:
              `${relationship.source}-${relationship.sourceColumn}-source`,

            targetHandle:
              `${relationship.target}-${relationship.targetColumn}-target`,

            type: "smoothstep",
            pathOptions: {
            offset: 15,
            borderRadius: 10,
            },


            style: {

              stroke:

                isSelected ||
                isHovered ||
                tableIsSelected

                  ? "#2563EB"

                  : "#94A3B8",


              strokeWidth:

                isSelected

                  ? 4

                  : isHovered

                    ? 3

                    : tableIsSelected

                      ? 3

                      : 1.5,


              opacity:

                selectedTable &&
                !tableIsSelected

                  ? 0.25

                  : 1,

            },

          };

        }
      )

    );

  }, [
    schema,
    selectedRelationship,
    hoveredRelationship,
    selectedTable,
    setEdges,
  ]);


  
  // Render
  

  return (
    <div
        style={{
      width: "100%",
      height: "100%",
        }}
    >

        {schema.tables.length === 0 ? (

      <div className="empty-schema">

        <div className="empty-schema-title">
          🐈‍⬛Simple db Visualizer🐾
        </div>

        <div className="empty-schema-text">
          Paste a SQL schema statment into the box above
          and click Visualize to start.
        </div>

      </div>

        ) : (

      <ReactFlow

        nodes={nodes}

        edges={edges}


        onNodesChange={onNodesChange}

        onEdgesChange={onEdgesChange}


        nodeTypes={nodeTypes}


        // Relationship click

        onEdgeClick={(event, edge) => {

          setSelectedRelationship(edge.id);

          setSelectedTable(null);

        }}


        // Relationship hover

        onEdgeMouseEnter={(event, edge) => {

          setHoveredRelationship(edge.id);

        }}


        onEdgeMouseLeave={() => {

          setHoveredRelationship(null);

        }}


        // Canvas click

        onPaneClick={() => {

          setSelectedRelationship(null);

          setSelectedTable(null);

        }}


        fitView

      >

        <Background />

        <Controls />

      </ReactFlow>

    )}

    </div>

  );

}


export default SchemaCanvas;