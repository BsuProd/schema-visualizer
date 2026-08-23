import { useState } from "react";

import SchemaCanvas from "./comp/SchemaCanvas";
import SqlInput from "./comp/SqlInput";

import { schema as defaultSchema } from "./data/schema";
import SchemaInfo from "./comp/SchemaInfo";
import { parseSQL } from "./data/sqlParser";

function App() {

  const [schema, setSchema] = useState({
  tables: [],
  relationships: [],
});

  function handleTryExample() {

    setSchema(defaultSchema);

}


  return (

    <div className="app">

      <header className="app-header">

        <div className="app-title">

          <h1>
            🐾Kat's Schema Visualizer
          </h1>

          <p>
            Visualize database tables and relationships.
          </p>

        </div>


        <SqlInput
          onSchemaParsed={setSchema}
        />

      </header>


      <main className="app-main">

        <div className="app-content">

          <SchemaInfo schema={schema} />

          <SchemaCanvas schema={schema}
          onTryExample={handleTryExample} />

        </div>

      </main>

    </div>

  );

}


export default App;