import { Handle, Position } from "reactflow";


function TableNode({ data }) {

  const table = data.table;

  const relationships = data.relationships || [];

  const selectedRelationship =
    data.selectedRelationship;

  const selectedTable =
    data.selectedTable;


  const isTableSelected =
    selectedTable === table.id;


  return (

    <div

      onClick={(event) => {

        event.stopPropagation();

        if (data.onTableClick) {

          data.onTableClick(table.id);

        }

      }}

      style={{

        position: "relative",

        background: "white",

        border:

          isTableSelected

            ? "2px solid #2563EB"

            : "2px solid black",

        boxShadow:

          isTableSelected

            ? "0 0 0 3px #DBEAFE"

            : "none",

        borderRadius: "6px",

        minWidth: "220px",

        overflow: "hidden",

      }}

    >


      {/* Table header */}

      <div

        style={{

          background: "#333",

          color: "white",

          padding: "10px",

          fontWeight: "bold",

        }}

      >

        {table.name}

      </div>


      {/* Columns */}

      <div>

        {table.columns.map((column) => {

          const relationship =

            relationships.find(

              (relationship) =>

                (

                  relationship.source === table.id &&

                  relationship.sourceColumn === column.name

                )

                ||

                (

                  relationship.target === table.id &&

                  relationship.targetColumn === column.name

                )

            );


          const isHighlighted =

            relationship &&

            relationship.id === selectedRelationship;


          return (

            <div

              key={column.name}

              style={{

                position: "relative",

                display: "flex",

                justifyContent: "space-between",

                padding: "8px 10px",

                borderBottom: "1px solid #ddd",

                background:

                  isHighlighted

                    ? "#DBEAFE"

                    : "white",

                color:

                  isHighlighted

                    ? "#2563EB"

                    : "#222",

                fontWeight:

                  isHighlighted

                    ? "bold"

                    : "normal",

              }}

            >


              {/* Incoming relationship */}

              {relationship &&

                relationship.target === table.id &&

                relationship.targetColumn === column.name && (

                  <Handle

                    type="target"

                    position={Position.Right}

                    id={

                      `${table.id}-${column.name}-target`

                    }

                  />

                )}


              <span>

                {column.primaryKey && "🔑 "}

                {column.foreignKey && "🔗 "}

                {column.name}

              </span>


              <span>

                {column.type}

              </span>


              {/* Outgoing relationship */}

              {relationship &&

                relationship.source === table.id &&

                relationship.sourceColumn === column.name && (

                  <Handle

                    type="source"

                    position={Position.Left}

                    id={

                      `${table.id}-${column.name}-source`

                    }

                  />

                )}

            </div>

          );

        })}

      </div>

    </div>

  );

}


export default TableNode;