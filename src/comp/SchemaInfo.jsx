import { useState } from "react";


function SchemaInfo({ schema }) {

  const [collapsed, setCollapsed] =
    useState(true);


  const tableCount =
    schema.tables.length;


  const relationshipCount =
    schema.relationships.length;


  const primaryKeyCount =
    schema.tables.reduce(
      (total, table) =>
        total +
        table.columns.filter(
          (column) =>
            column.primaryKey
        ).length,
      0
    );


  const foreignKeyCount =
    schema.tables.reduce(
      (total, table) =>
        total +
        table.columns.filter(
          (column) =>
            column.foreignKey
        ).length,
      0
    );


  const connectedTableIds =
    new Set();


  schema.relationships.forEach(
    (relationship) => {

      connectedTableIds.add(
        relationship.source
      );

      connectedTableIds.add(
        relationship.target
      );

    }
  );


  const connectedTableCount =
    connectedTableIds.size;


  const disconnectedTableCount =
    tableCount -
    connectedTableCount;


  return (

    <div
      className={
        collapsed
          ? "schema-info schema-info-collapsed"
          : "schema-info"
      }
    >

      <div className="schema-info-header">

        <div className="schema-info-title">
          Schema Stats
        </div>


        <button
          className="schema-info-toggle"
          onClick={() =>
            setCollapsed(
              !collapsed
            )
          }
          title={
            collapsed
              ? "Expand"
              : "Minimize"
          }
        >
          {collapsed ? "+" : "−"}
        </button>

      </div>


      {!collapsed && (
        

        schema.tables.length === 0 ? (

        <div className="schema-info-empty">
          No schema loaded
        </div>

  ) : (

        <>

          <div className="schema-info-row">
            <span>Tables</span>
            <strong>{tableCount}</strong>
          </div>


          <div className="schema-info-row">
            <span>Relationships</span>
            <strong>{relationshipCount}</strong>
          </div>


          <div className="schema-info-row">
            <span>Primary Keys</span>
            <strong>{primaryKeyCount}</strong>
          </div>


          <div className="schema-info-row">
            <span>Foreign Keys</span>
            <strong>{foreignKeyCount}</strong>
          </div>


          <div className="schema-info-divider" />


          <div className="schema-info-row">
            <span>Connected Tables</span>
            <strong>{connectedTableCount}</strong>
          </div>


          <div className="schema-info-row">
            <span>Disconnected Tables</span>
            <strong>
              {disconnectedTableCount}
            </strong>
          </div>

        </>
      )

      )}

    </div>

  );

}


export default SchemaInfo;