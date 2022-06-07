import convert from "hasura-camelize";

convert(
  // connection settings
  {
    // domain name
    host: "https://round-schema.hasura.app",
    // or ip
    // host: 'http://127.0.0.1:3000',
    // admin secret
    secret: "ZYUgSbpdiQ4ItY6u6sJ7oHu9AzYvxHEp2fFm96ktVrFJO3pIM2vpPizvCLmIS3mf",
    schema: "sales",
  },
  // optional settings
  {
    // Dry run? (don't apply changes)
    dry: false,
    // Rename relations? (default false)
    relations: true,
    // Transform table names differently
    transformTableNames(name, defaultTransformer) {
      // if name === some_name then ignore the table
      if (name === "spatial_ref_sys") return false;
      if (name === "geography_columns") return false;
      if (name === "geometry_columns") return false;

      return defaultTransformer(name);
    },

    // // Transform column names differently
    // transformColumnNames(name, tableName, defaultTransformer) {
    //   // if name === some_name then ignore the column
    //   if (name === "some_name" && tableName === "some_name") return false;
    //   return defaultTransformer(name);
    // },
    // // Apply different root field names
    // getRootFieldNames(name, defaultTransformer) {
    //   return defaultTransformer(name);
    // },
  }
);
