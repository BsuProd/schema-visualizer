# 🐈‍⬛ Kat's Schema Visualizer

Kat's Schema Visualizer is a browser-based React application that turns SQL `CREATE TABLE` statements into an interactive database schema diagram.

This project started with a problem I encountered while working through Harvard's **CS50** course. When working on SQL exercises, especially the Fiftyville problem set, I found myself dealing with increasingly large database schemas and relationships between tables. Reading the SQL was possible, but keeping track of how all the tables connected became much harder.

I wanted a way to see the database instead of constantly going on the command line to type .schema or trying to hold its structure in my head.

So I built one.

Hosted :`https://github.com/BsuProd/schema-visualizer`

Kat's Schema Visualizer takes simple SQL schema definitions, parses them in the browser, and turns them into a visual representation where tables, columns, keys, and relationships can be explored interactively.

This is my first published web project, and it has also been a practical way to learn React, JavaScript, state management, parsing, graph visualization, responsive design, and deployment.

## What It Does

The application currently supports:

- Parsing SQL `CREATE TABLE` statements directly in the browser
- Detecting tables and their columns
- Detecting column data types
- Detecting primary keys
- Detecting foreign keys
- Creating relationships between related tables
- Displaying the schema using React Flow
- Automatically arranging tables based on their relationships
- Separating connected and disconnected tables
- Selecting tables and highlighting their relationships
- Selecting and highlighting individual relationships
- Displaying schema statistics
- Collapsing the schema statistics panel
- Validating empty or invalid SQL input
- Displaying success messages when a schema is loaded
- Clearing both the SQL input and current visualization
- Loading a built-in example schema with **Try Example Schema**
- Providing a responsive interface for smaller screens
- Providing a small amount of cat-themed personality through the branding

## The Basic Idea

The application follows a fairly simple flow:

```text
SQL Input
    ↓
sqlParser.js
    ↓
Schema Object
    ↓
App.jsx
    ↓
SchemaInfo + SchemaCanvas
```

The user enters a SQL schema and selects **Visualize**.

`sqlParser.js` processes the SQL and creates a structured JavaScript object containing the tables, columns, and relationships.

That schema is passed back to `App.jsx`, which keeps it in React state.

From there, the same schema is used by two different parts of the application:

- `SchemaInfo.jsx` displays information about the schema.
- `SchemaCanvas.jsx` turns the schema into an interactive diagram.

Keeping these responsibilities separate made the application easier to understand and gave me a much cleaner foundation to build on.

## Running Locally

Install the project dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

## Deployment

The project is hosted for free using **GitHub Pages** and deployed through **GitHub Actions**.

Repository:

`https://github.com/BsuProd/schema-visualizer`

The deployment workflow builds the Vite application and publishes the resulting production files to GitHub Pages.

This was one of the goals of the project from the beginning: build something real, publish it, and make it accessible without needing paid hosting or a separate server.

## Why I Built It This Way

One of the main goals of this project was not just to make something that worked, but to understand how the different parts fit together.

### Browser-based processing

There is no backend server involved.

The SQL is processed directly in the browser, which keeps the project simple and means the application can be hosted for free with GitHub Pages.

It also means there is no need to send a user's SQL schema to a server just to visualize it.

### React Flow

Rather than building an interactive graph system from scratch, I used React Flow as the foundation for the diagram.

React Flow provides the infrastructure for nodes, edges, zooming, panning, selection, and interaction. This allowed me to concentrate on the actual problem I wanted to solve: turning database relationships into something useful to look at.

### A separate parser

The SQL parser lives independently from the React interface.

This was an important design decision. The UI should not need to know how SQL is interpreted, and the parser should not need to know how the tables are displayed.

The parser produces the data structure the rest of the application needs, creating a clear boundary between processing and presentation.

## Automatic Table Layout

One of the more interesting parts of the project is the automatic table layout.

`SchemaCanvas.jsx` contains a `createAutomaticLayout()` function that examines the relationships between tables and uses them to calculate where the tables should appear.

The process roughly works like this:

1. Build a connection map from the relationships.
2. Find groups of connected tables.
3. Determine levels within those groups.
4. Position tables according to their level.
5. Arrange tables within each level.
6. Place disconnected tables separately.

This means a user can paste a schema containing many tables and immediately get a usable starting layout instead of having to drag every table into position manually.

It is intentionally not a complicated database-layout engine. The goal was to create something understandable, predictable, and useful while keeping the implementation within the scope of the project.

## Project Structure

```text
public/
└── cat1.svg                  # Project logo

src/
├── App.jsx                   # Main application and schema state
├── main.jsx                  # React entry point
├── index.css                 # Global styling
│
├── comp/
│   ├── SqlInput.jsx          # SQL input and validation
│   ├── SchemaCanvas.jsx      # Visualization and automatic layout
│   ├── SchemaInfo.jsx        # Schema statistics
│   └── TableNode.jsx         # Individual table visualization
│
└── data/
    ├── sqlParser.js          # SQL parsing logic
    └── schema.js             # Built-in example schema
```

### `App.jsx`

The main application component.

It owns the current schema state and connects the SQL input to the rest of the application through the `onSchemaParsed` callback.

### `SqlInput.jsx`

Handles the SQL textarea, validation, success and error messages, and the Visualize and Clear controls.

I experimented with the designs and the current design keeps the SQL input on the right side of the header. Validation messages also appear alongside the input rather than moving underneath the main title which felt most fitting.

### `SchemaCanvas.jsx`

Controls the main database visualization.

It creates React Flow nodes from the tables and edges from the relationships. It also handles automatic positioning, table selection, relationship selection, hover states, and the empty state shown before a schema has been loaded.

### `SchemaInfo.jsx`

Displays statistics about the loaded schema, including:

- Tables
- Relationships
- Primary keys
- Foreign keys
- Connected tables
- Disconnected tables

The panel can be collapsed when it is not needed.

### `TableNode.jsx`

Controls the appearance of individual tables inside the React Flow canvas, including their columns and connection points.

### `sqlParser.js`

Contains the SQL parsing logic.

It converts supported `CREATE TABLE` definitions into the internal schema structure used by the application.

### `schema.js`

Contains the structured example schema used by the **Try Example Schema** functionality.

Keeping the example in the same structured format expected by the application means it can be loaded directly without unnecessarily parsing it again.

In previous itirations schema.js had a simple two table schema that would be displayed by default on site enterence, However the change to add a Try schema button instead improved the use flow in the latest version.

## Validation and User Feedback

The input system includes basic validation before attempting to visualize a schema.
An empty input produces an error instead of attempting to parse nothing.
If a valid schema is loaded, the application reports the number of tables and relationships that were found.
The Clear button resets both the SQL input and the current schema state, returning the canvas to its empty state.
These details are small, but they make the application much easier to understand when something goes wrong.

## Responsive Design

The application has been adjusted to remain usable on smaller screens while keeping the established desktop design.

The SQL input remains on the right side of the header rather than being moved underneath the title. The responsive changes focus on sizing, spacing, and making the existing interface work across different screen sizes. This was a deliberate decision to improve mobile usability without redesigning the entire interface.

## What I Learned

This project has been about much more than getting a diagram onto a screen. It has given me practical experience with React components, state, props, event handling, parsing structured text, graph relationships, automatic positioning, responsive CSS, Git, GitHub, Vite, and continuous deployment. More importantly, it gave me a chance to take a problem I actually encountered while learning SQL and turn it into something useful.

There is still plenty I would like to improve, but getting the application from an idea, through development and debugging, to a publicly hosted project has been one of the most exciting and rewarding parts of building it especailly getting over the git.fears of deployment.

## Future Improvements

The current version focuses on the core visualization experience.

Possible future improvements include:

- Exporting diagrams as images
- Saving and loading schemas
- Searching and filtering tables
- Supporting more SQL syntax and SQL dialects
- Improving automatic layout for very large schemas
- Adding additional diagram customization options

These are future ideas rather than features currently implemented in the application.

## Credits

**Author:** BsuProd

**Project:** Kat's Schema Visualizer

**Logo:** *Cat* by **Worapong Saleewong**, used as the project's logo in `public/cat1.svg`.
