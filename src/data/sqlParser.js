export function parseSQL(sql) {

  const tables = [];
  const relationships = [];


  
  // Split definitions by commas
  // but ignore commas inside ()
  

  function splitDefinitions(text) {

    const definitions = [];

    let current = "";

    let depth = 0;


    for (const character of text) {

      if (character === "(") {
        depth++;
      }

      if (character === ")") {
        depth--;
      }


      if (character === "," && depth === 0) {

        if (current.trim()) {
          definitions.push(current.trim());
        }

        current = "";

      } else {

        current += character;

      }

    }


    if (current.trim()) {
      definitions.push(current.trim());
    }


    return definitions;
  }


  
  // Find CREATE TABLE statements
  

  const createTableRegex =
    /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(\w+)\s*\(/gi;


  let match;


  while ((match = createTableRegex.exec(sql)) !== null) {

    const tableName = match[1];

    const openingParenthesisIndex =
      createTableRegex.lastIndex - 1;


    
    // Find matching closing )
    

    let depth = 1;

    let index = openingParenthesisIndex + 1;


    while (
      index < sql.length &&
      depth > 0
    ) {

      if (sql[index] === "(") {
        depth++;
      }

      else if (sql[index] === ")") {
        depth--;
      }

      index++;

    }


    // Couldn't find closing )
    if (depth !== 0) {
      continue;
    }


    const closingParenthesisIndex =
      index - 1;


    const tableBody =
      sql.substring(
        openingParenthesisIndex + 1,
        closingParenthesisIndex
      );


    const lines =
      splitDefinitions(tableBody);


    const columns = [];


    
    // Find columns
    

    for (const line of lines) {

      // Ignore table-level constraints

      if (
        /^PRIMARY\s+KEY/i.test(line) ||
        /^FOREIGN\s+KEY/i.test(line) ||
        /^UNIQUE/i.test(line) ||
        /^CONSTRAINT/i.test(line)
      ) {

        continue;

      }


      const columnMatch =
        line.match(
          /^(\w+)\s+([A-Z]+(?:\s*\([^)]*\))?)([\s\S]*)$/i
        );


      if (!columnMatch) {
        continue;
      }


      const columnName =
        columnMatch[1];

      const columnType =
        columnMatch[2];

      const columnOptions =
        columnMatch[3];


      columns.push({

        name: columnName,

        type: columnType,

        primaryKey:
          /PRIMARY\s+KEY/i.test(columnOptions),

        foreignKey: false,

      });

    }


    
    // Add table
    

    const table = {

      id: tableName,

      name: tableName,

      columns,

    };


    tables.push(table);


    
    // Table-level PRIMARY KEY
    

    for (const line of lines) {

      const primaryKeyMatch =
        line.match(
          /^PRIMARY\s+KEY\s*\(([^)]+)\)/i
        );


      if (!primaryKeyMatch) {
        continue;
      }


      const primaryKeyColumns =
        primaryKeyMatch[1]
          .split(",")
          .map((column) => column.trim());


      for (const primaryKeyColumn of primaryKeyColumns) {

        const column =
          table.columns.find(
            (column) =>
              column.name === primaryKeyColumn
          );


        if (column) {

          column.primaryKey = true;

        }

      }

    }


    
    // FOREIGN KEY relationships
    

    for (const line of lines) {

      const foreignKeyMatch =
        line.match(
          /^FOREIGN\s+KEY\s*\(\s*(\w+)\s*\)\s+REFERENCES\s+(\w+)\s*\(\s*(\w+)\s*\)/i
        );


      if (!foreignKeyMatch) {
        continue;
      }


      const sourceColumn =
        foreignKeyMatch[1];

      const targetTable =
        foreignKeyMatch[2];

      const targetColumn =
        foreignKeyMatch[3];


      // Make relationship ID unique.

      const relationshipId =
        `${tableName}-${sourceColumn}-${targetTable}-${targetColumn}`;


      relationships.push({

        id: relationshipId,

        source: tableName,

        sourceColumn: sourceColumn,

        target: targetTable,

        targetColumn: targetColumn,

      });


      
      // Mark foreign key column
      

      const sourceColumnObject =
        table.columns.find(
          (column) =>
            column.name === sourceColumn
        );


      if (sourceColumnObject) {

        sourceColumnObject.foreignKey = true;

      }

    }

  }


  return {

    tables,

    relationships,

  };

}