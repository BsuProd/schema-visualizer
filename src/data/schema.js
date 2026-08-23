export const schema = {
tables: [
{
id: "crime_scene_reports",
name: "crime_scene_reports",
columns: [
{ name: "id", type: "INTEGER", primaryKey: true },
{ name: "year", type: "INTEGER" },
{ name: "month", type: "INTEGER" },
{ name: "day", type: "INTEGER" },
{ name: "street", type: "TEXT" },
{ name: "description", type: "TEXT" },
],
},


{
  id: "interviews",
  name: "interviews",
  columns: [
    { name: "id", type: "INTEGER", primaryKey: true },
    { name: "name", type: "TEXT" },
    { name: "year", type: "INTEGER" },
    { name: "month", type: "INTEGER" },
    { name: "day", type: "INTEGER" },
    { name: "transcript", type: "TEXT" },
  ],
},

{
  id: "atm_transactions",
  name: "atm_transactions",
  columns: [
    { name: "id", type: "INTEGER", primaryKey: true },
    { name: "account_number", type: "INTEGER" },
    { name: "year", type: "INTEGER" },
    { name: "month", type: "INTEGER" },
    { name: "day", type: "INTEGER" },
    { name: "atm_location", type: "TEXT" },
    { name: "transaction_type", type: "TEXT" },
    { name: "amount", type: "INTEGER" },
  ],
},

{
  id: "bank_accounts",
  name: "bank_accounts",
  columns: [
    { name: "account_number", type: "INTEGER" },
    { name: "person_id", type: "INTEGER", foreignKey: true },
    { name: "creation_year", type: "INTEGER" },
  ],
},

{
  id: "airports",
  name: "airports",
  columns: [
    { name: "id", type: "INTEGER", primaryKey: true },
    { name: "abbreviation", type: "TEXT" },
    { name: "full_name", type: "TEXT" },
    { name: "city", type: "TEXT" },
  ],
},

{
  id: "flights",
  name: "flights",
  columns: [
    { name: "id", type: "INTEGER", primaryKey: true },
    { name: "origin_airport_id", type: "INTEGER", foreignKey: true },
    {
      name: "destination_airport_id",
      type: "INTEGER",
      foreignKey: true,
    },
    { name: "year", type: "INTEGER" },
    { name: "month", type: "INTEGER" },
    { name: "day", type: "INTEGER" },
    { name: "hour", type: "INTEGER" },
    { name: "minute", type: "INTEGER" },
  ],
},

{
  id: "passengers",
  name: "passengers",
  columns: [
    { name: "flight_id", type: "INTEGER", foreignKey: true },
    { name: "passport_number", type: "INTEGER" },
    { name: "seat", type: "TEXT" },
  ],
},

{
  id: "phone_calls",
  name: "phone_calls",
  columns: [
    { name: "id", type: "INTEGER", primaryKey: true },
    { name: "caller", type: "TEXT" },
    { name: "receiver", type: "TEXT" },
    { name: "year", type: "INTEGER" },
    { name: "month", type: "INTEGER" },
    { name: "day", type: "INTEGER" },
    { name: "duration", type: "INTEGER" },
  ],
},

{
  id: "people",
  name: "people",
  columns: [
    { name: "id", type: "INTEGER", primaryKey: true },
    { name: "name", type: "TEXT" },
    { name: "phone_number", type: "TEXT" },
    { name: "passport_number", type: "INTEGER" },
    { name: "license_plate", type: "TEXT" },
  ],
},

{
  id: "bakery_security_logs",
  name: "bakery_security_logs",
  columns: [
    { name: "id", type: "INTEGER", primaryKey: true },
    { name: "year", type: "INTEGER" },
    { name: "month", type: "INTEGER" },
    { name: "day", type: "INTEGER" },
    { name: "hour", type: "INTEGER" },
    { name: "minute", type: "INTEGER" },
    { name: "activity", type: "TEXT" },
    { name: "license_plate", type: "TEXT" },
  ],
},


],

relationships: [
{
id: "bank_accounts-person_id-people-id",
source: "bank_accounts",
sourceColumn: "person_id",
target: "people",
targetColumn: "id",
},


{
  id: "flights-origin_airport_id-airports-id",
  source: "flights",
  sourceColumn: "origin_airport_id",
  target: "airports",
  targetColumn: "id",
},

{
  id: "flights-destination_airport_id-airports-id",
  source: "flights",
  sourceColumn: "destination_airport_id",
  target: "airports",
  targetColumn: "id",
},

{
  id: "passengers-flight_id-flights-id",
  source: "passengers",
  sourceColumn: "flight_id",
  target: "flights",
  targetColumn: "id",
},


],
};
