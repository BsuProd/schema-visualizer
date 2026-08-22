import { useState } from "react";

import { parseSQL } from "../data/sqlParser";


function SqlInput({ onSchemaParsed }) {

  const [sql, setSql] = useState("");

  const [message, setMessage] = useState("");

  const [messageType, setMessageType] = useState("");


  function handleVisualize() {

    setMessage("");
    setMessageType("");


    if (!sql.trim()) {

      setMessage("Please enter a SQL schema.");

      setMessageType("error");

      return;
    }


    try {

      const newSchema = parseSQL(sql);


      if (
        !newSchema ||
        newSchema.tables.length === 0
      ) {

        setMessage("No tables were found in the SQL.");

        setMessageType("error");

        return;
      }


      onSchemaParsed(newSchema);


      const tableWord =
        newSchema.tables.length === 1
          ? "table"
          : "tables";


      const relationshipWord =
        newSchema.relationships.length === 1
          ? "relationship"
          : "relationships";


      const successMessage =
        "Schema loaded successfully: " +
        newSchema.tables.length +
        " " +
        tableWord +
        " and " +
        newSchema.relationships.length +
        " " +
        relationshipWord +
        ".";


      setMessage(successMessage);

      setMessageType("success");

    } catch (error) {

      console.error(error);

      setMessage("Unable to parse the SQL schema.");

      setMessageType("error");

    }

  }


  function handleClear() {

    setSql("");

    setMessage("");

    setMessageType("");


    onSchemaParsed({
      tables: [],
      relationships: [],
    });

  }


  return (

    <div className="sql-input">

      <textarea
        value={sql}
        onChange={(event) => {

          setSql(event.target.value);

          setMessage("");

          setMessageType("");

        }}
        placeholder="Paste CREATE TABLE statement here..."
        rows="3"
      />


      <div className="sql-actions">

        <button
          onClick={handleVisualize}
        >
          Visualize
        </button>


        <button
          onClick={handleClear}
        >
          Clear
        </button>

      </div>


      {message && (
        <div className={"sql-message " + messageType}>
          {message}
        </div>
      )}

    </div>

  );

}


export default SqlInput;

