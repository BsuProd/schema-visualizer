export const schema = {
    tables: [
        {
            id: "users",
            name: "Example",
            columns: [
                {
                    name: "id",
                    type: "INTEGER",
                    primaryKey: true
                },
                {
                    name:"name",
                    type:"TEXT"
                },
                {
                    name:"email",
                    type:"TEXT"
                }
            ]
        },
        
        {
            id:"orders",
            name:"Tables",
            columns: [
                {
                    name:"id",
                    type:"INTEGER",
                    primaryKey: true
                }, 
                {
                    name:"user_id",
                    type:"INTEGER",
                    foreignKey: true
                },
                {
                    name:"created_at",
                    type:"TIMESTAMP"
                }
            ]
        }
    ],

    relationships: [
        {
            id: "orders-users",
            source:"orders",
            sourceColumn:"user_id",
            target:"users",
            targetColumn:"id"
        }
    ]
};