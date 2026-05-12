import { parseStringPromise } from "xml2js";
import JSZip from "jszip";

export const CableFiberOpticService = {
  async getAllCable(db: any) {
    const client = await db.connect();
    try {
      const sql = `
      SELECT
        id,
        cable_code,
        ST_AsGeoJSON(geom)::json AS geom
      FROM cables;
      `;
      const res = await client.query(sql);
      console.log(res.rows);

      return {
        data: res.rows,
        success: true
      }
    } catch (err) {
      return {
        success: false
      }
    } finally {

    }
  },

  async bulkInsert(
    client: any,
    rows: any[]
  ) {

    const values: string[] = [];

    const params: any[] = [];

    let index = 1;

    for (const row of rows) {

      values.push(`
      (
        $${index++},
        $${index++},
        $${index++},
        $${index++},
        CURRENT_DATE,
        $${index++},
        ST_GeomFromText(
          $${index++},
          4326
        )
      )
    `);

      params.push(
        row.cable_code,
        row.cable_type,
        row.status,
        row.source,
        row.note,
        row.wkt
      );
    }

    const query = `
    INSERT INTO cables (
      cable_code,
      cable_type,
      status,
      source,
      survey_date,
      note,
      geom
    )
    VALUES
    ${values.join(",")}
  `;

    await client.query(query, params);
  },

  async UploadCable(file: File, db: any) {

    const extractPlacemarks = (
      node: any
    ): any[] => {

      let placemarks: any[] = [];

      // Placemark
      if (node?.Placemark) {

        placemarks.push(
          ...node.Placemark
        );
      }

      // Folder
      if (node?.Folder) {

        for (const folder of node.Folder) {

          placemarks.push(
            ...extractPlacemarks(folder)
          );
        }
      }

      return placemarks;
    };

    const client = await db.connect();

    try {

      let kmlText = "";

      // =========================
      // KML
      // =========================
      if (
        file.name
          .toLowerCase()
          .endsWith(".kml")
      ) {

        kmlText = await file.text();

      }

      // =========================
      // KMZ
      // =========================
      else if (
        file.name
          .toLowerCase()
          .endsWith(".kmz")
      ) {

        const buffer =
          await file.arrayBuffer();

        const zip =
          await JSZip.loadAsync(buffer);

        const kmlFileName =
          Object.keys(zip.files).find(
            (name) =>
              name
                .toLowerCase()
                .endsWith(".kml")
          );

        if (!kmlFileName) {
          throw new Error(
            "KML file not found inside KMZ"
          );
        }

        kmlText =
          await zip.files[
            kmlFileName
          ].async("text");

      } else {

        throw new Error(
          "Unsupported file type"
        );

      }

      // =========================
      // Parse XML
      // =========================
      const result =
        await parseStringPromise(kmlText);

      const document =
        result?.kml?.Document?.[0];

      const placemarks =
        extractPlacemarks(document);

      // =========================
      // Begin Transaction
      // =========================
      await client.query("BEGIN");

      let insertedCount = 0;

      // batch size
      const batchSize = 1000;

      // temp rows
      let rows: any[] = [];

      for (const placemark of placemarks) {

        const name =
          placemark?.name?.[0] || null;

        const lineString =
          placemark?.LineString?.[0];

        if (!lineString) continue;

        const coordinatesText =
          lineString?.coordinates?.[0];

        if (!coordinatesText) continue;

        // =========================
        // Convert Coordinates
        // =========================
        const coordinates =
          coordinatesText
            .trim()
            .split(/\s+/)
            .map((coord: string) => {

              const [lng, lat] =
                coord.split(",");

              return `${lng} ${lat}`;

            });

        const wkt =
          `LINESTRING(${coordinates.join(", ")})`;

        rows.push({
          cable_code: name,
          cable_type: "fiber_optic",
          status: "observed",
          source: file.name,
          note: "Imported from KML/KMZ",
          wkt,
        });

        // =========================
        // Batch Insert
        // =========================
        if (rows.length >= batchSize) {

          await this.bulkInsert(
            client,
            rows
          );

          insertedCount += rows.length;

          console.log(
            `Inserted ${insertedCount}`
          );

          rows = [];
        }
      }

      // =========================
      // Insert Remaining Rows
      // =========================
      if (rows.length > 0) {

        await this.bulkInsert(
          client,
          rows
        );

        insertedCount += rows.length;
      }

      // =========================
      // Commit
      // =========================
      await client.query("COMMIT");

      return {
        success: true,
        inserted: insertedCount,
        message: "Upload success",
      };

    } catch (error: any) {

      await client.query("ROLLBACK");

      console.error(error);

      return {
        success: false,
        message:
          error.message ||
          "Upload failed",
      };

    } finally {

      client.release();

    }
  },


};