import { parseStringPromise } from "xml2js";
import JSZip from "jszip";

export const CableFiberOpticService = {
  async getALLCable(db: any) {
    const client = await db.connect();
    try {
      const sql = `SELECT * FORM cable`;
      const res = await client.query(sql);
      console.log(res);

      return {
        success: true
      }
    } catch (err) {
      return {
        success: false
      }
    } finally {

    }
  },

  async UploadCable(file: File, db: any) {
    const client = await db.connect();
    try {
      let kmlText = "";

      // =========================
      // KML
      // =========================
      if (file.name.toLowerCase().endsWith(".kml")) {
        kmlText = await file.text();
      }

      // =========================
      // KMZ
      // =========================
      else if (file.name.toLowerCase().endsWith(".kmz")) {
        const buffer = await file.arrayBuffer();

        const zip = await JSZip.loadAsync(buffer);

        // หาไฟล์ .kml ใน zip
        const kmlFileName = Object.keys(zip.files).find(
          (name) => name.toLowerCase().endsWith(".kml")
        );

        if (!kmlFileName) {
          throw new Error("KML file not found inside KMZ");
        }

        kmlText = await zip.files[kmlFileName].async("text");
      } else {
        throw new Error("Unsupported file type");
      }

      // =========================
      // Parse XML
      // =========================
      const result = await parseStringPromise(kmlText);

      const placemarks =
        result?.kml?.Document?.[0]?.Placemark || [];

      let insertedCount = 0;

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
        // Convert coordinates
        // =========================
        const coordinates = coordinatesText
          .trim()
          .split(/\s+/)
          .map((coord: string) => {
            const [lng, lat] = coord.split(",");

            return `${lng} ${lat}`;
          });

        const wkt = `LINESTRING(${coordinates.join(", ")})`;

        // =========================
        // Insert Database
        // =========================
        await client.query(
          `
          INSERT INTO cables (
            cable_code,
            cable_type,
            status,
            source,
            survey_date,
            note,
            geom
          )
          VALUES (
            $1,
            $2,
            $3,
            $4,
            CURRENT_DATE,
            $5,
            ST_GeomFromText($6, 4326)
          )
          `,
          [
            name,
            "fiber_optic",
            "observed",
            file.name,
            "Imported from KML/KMZ",
            wkt,
          ]
        );

        insertedCount++;
      }

      return {
        success: true,
        inserted: insertedCount,
        message: "Upload success",
      };
    } catch (error: any) {
      console.error(error);

      return {
        success: false,
        message: error.message || "Upload failed",
      };
    }
  },


};