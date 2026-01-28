<script setup lang="ts">
import { onMounted, ref } from "vue";
import { PMApiService } from "../../services/pm_nodeb.api";
import {
  getRectifierConfig,
  getSiteInformationConfig,
  getKwhMeterConfig,
  getTransformerConfig,
  getGeneratorConfig,
  getSiteFacilityConfig,
  getVoltageInputConfig,
  getMdbAcConfig,
  getGroundSystemConfig,
  getExternalAlarmBeforeConfig,
  getNodeBTxConfig
} from "../../services/pmConfig.api";

const sections = ref<any[]>([]); // ⭐ เพิ่มบรรทัดนี้
const form = ref<Record<string, any>>({});
const expandedCards = ref<Record<string, boolean>>({});
const expandedSections = ref<Record<string, boolean>>({});

const site_id = ref("");
const node_type = ref("");
const round = ref("");
const cabinet_total = ref("");
const region = ref("");
const datetime = ref("");
const status = ref("");
const planwork = ref("");
const created_by = ref("");
const remark = ref("");

interface AllField {
  field: string;
  label: string;
  result: boolean;
  value: boolean;
  remark: boolean;
  img?: string;
  required: boolean;
}

// สำหรับซ่อน/แสดง PM Information section
const showPmInfo = ref(true);

onMounted(async () => {
  const siteRes = await getSiteInformationConfig();
  const kwhRes = await getKwhMeterConfig();
  const transformerRes = await getTransformerConfig();
  const generatorRes = await getGeneratorConfig();
  const site_facilityRes = await getSiteFacilityConfig();
  const voltage_inputRes = await getVoltageInputConfig();
  const mdb_acRes = await getMdbAcConfig();
  const groundSysRes = await getGroundSystemConfig();
  const externalAarmBeforeRes = await getExternalAlarmBeforeConfig();
  const nodebTxRes = await getNodeBTxConfig();
  const rectifierRes = await getRectifierConfig();

  sections.value = [
    {
      key: "site_information",
      title: "#1 - Site Information",
      fields: siteRes.fields.filter((f: AllField) => f.result),
    },
    {
      key: "kwh_meter",
      title: "#2 - KWH Meter",
      fields: kwhRes.fields.filter((f: AllField) => f.result),
    },
    {
      key: "transformer",
      title: "#3 - Transformer *หม้อแปลงไฟฟ้า",
      fields: transformerRes.fields.filter((f: AllField) => f.result),
    },
    {
      key: "generator",
      title: "#4 - Generator *เครื่องปั่นไฟ",
      fields: generatorRes.fields.filter((f: AllField) => f.result),
    },
    {
      key: "site_facility",
      title: "#5 - Site Facility",
      fields: site_facilityRes.fields.filter((f: AllField) => f.result),
    },
    {
      key: "voltage_input",
      title: "#6 - Voltage Input",
      fields: voltage_inputRes.fields.filter((f: AllField) => f.result),
    },
    {
      key: "mdb_ac",
      title: "#7 - MDB (AC) *การทำ PM ต้อง Off Solar Cell",
      fields: mdb_acRes.fields.filter((f: AllField) => f.result),
    },
    {
      key: "groundingsystem",
      title: "#8 - Grounding System",
      fields: groundSysRes.fields.filter((f: AllField) => f.result),
    },
    {
      key: "externalalarmbefore",
      title: "#9 - External Alarm (Before PM) *ก่อนทำ PM ให้ตรวจสอบ alarm จาก PMBOT (-checkpmhistory SiteID)",
      fields: externalAarmBeforeRes.fields.filter((f: AllField) => f.result),
    },
    {
      key: "nodebTx",
      title: "#10 - NodeB & TX Equipment",
      fields: nodebTxRes.fields.filter((f: AllField) => f.result),
    },
    {
      key: "rectifier",
      title: "#11 - Rectifier",
      fields: rectifierRes.fields.filter((f: AllField) => f.result),
    },
  ];

  // init form + expanded
  sections.value.forEach((section) => {
    expandedSections.value[section.key] = true; // เปิด section ทั้งหมดตอนเริ่มต้น
    
    section.fields.forEach((f: any) => {
      expandedCards.value[f.field] = true;

      if (f.result) form.value[`${f.field}_result`] = "";
      if (f.value) form.value[`${f.field}_value`] = "";
      if (f.remark) form.value[`${f.field}_remark`] = "";
    });
  });
});

const toggleCard = (fieldName: string) => {
  expandedCards.value[fieldName] = !expandedCards.value[fieldName];
};

const togglePmInfo = () => {
  showPmInfo.value = !showPmInfo.value;
};

// ฟังก์ชันซ่อน/แสดงทั้งหมดใน section
const toggleSection = (sectionKey: string) => {
  const isExpanded = !expandedSections.value[sectionKey];
  expandedSections.value[sectionKey] = isExpanded;
  
  // ถ้าแสดง section ให้เปิดทุก card ใน section นั้น
  const section = sections.value.find((s) => s.key === sectionKey);
  if (section) {
    section.fields.forEach((f: any) => {
      expandedCards.value[f.field] = isExpanded;
    });
  }
};

const handlePmNodeB = async () => {
  const result = await PMApiService.pm_nodeb(
    site_id.value,
    node_type.value,
    round.value,
    cabinet_total.value,
    region.value,
    datetime.value,
    status.value,
    planwork.value,
    created_by.value,
    remark.value
  );
  if (result.success) {
    window.location.href = "/home";
  } else {
    console.log(false);
  }
};
</script>

<template>
  <form @submit.prevent="handlePmNodeB">
    <!-- PM Information Section -->
    <div class="section-card">
      <div class="section-header" @click="togglePmInfo">
        <h2>PM Information</h2>
        <button type="button" class="toggle-btn">
          {{ showPmInfo ? "−" : "+" }}
        </button>
      </div>

      <transition name="slide">
        <div v-show="showPmInfo" class="box">
          <div class="card">
            <div class="form-group">
              <label>Site ID :</label>
              <input v-model="site_id" type="text" name="site_id" required />
            </div>

            <div class="form-group">
              <label>Node Type</label>
              <select v-model="node_type" name="node_type">
                <option value="">Select...</option>
                <option value="NodeB">NodeB</option>
                <option value="SmallExchange">Small Exchange</option>
                <option value="MediumExchange">Medium Exchange</option>
                <option value="Boardband">Boardband</option>
                <option value="Mowing">Mowing</option>
                <option value="SolarCell">Solar Cell</option>
              </select>
            </div>

            <div class="form-group">
              <label>Round :</label>
              <input v-model="round" type="text" name="round" />
            </div>

            <div class="form-group">
              <label>Cabinet Total :</label>
              <input v-model="cabinet_total" type="text" name="cabinet_total" />
            </div>

            <div class="form-group">
              <label>Region</label>
              <input v-model="region" type="text" name="region" />
            </div>

            <div class="form-group">
              <label>PM Date</label>
              <input v-model="datetime" type="datetime-local" name="datetime" />
            </div>

            <div class="form-group">
              <label>Site Status</label>
              <input v-model="status" type="text" name="status" />
            </div>

            <div class="form-group">
              <label>Planwork</label>
              <input v-model="planwork" type="text" name="planwork" />
            </div>

            <div class="form-group">
              <label>Created by</label>
              <input v-model="created_by" type="text" name="created_by" />
            </div>

            <div class="form-group">
              <label>Remark</label>
              <input v-model="remark" type="text" name="remark" />
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- Dynamic Sections -->
    <div v-for="section in sections" :key="section.key" class="section-card">
      <div class="section-header" @click="toggleSection(section.key)">
        <h2>{{ section.title }}</h2>
        <button type="button" class="toggle-btn">
          {{ expandedSections[section.key] ? "−" : "+" }}
        </button>
      </div>

      <transition name="slide">
        <div v-show="expandedSections[section.key]" class="card-content">
          <div v-for="f in section.fields" :key="f.field" class="field-card">
            <div class="card-header" @click="toggleCard(f.field)">
              <h3>
                {{ f.label }}
                <span v-if="f.required" class="text-red-500">*</span>
              </h3>
              <button type="button" class="toggle-btn-small">
                {{ expandedCards[f.field] ? "−" : "+" }}
              </button>
            </div>

            <transition name="slide">
              <div v-show="expandedCards[f.field]" class="field-content">
                <!-- Result -->
                <div v-if="f.result" class="input-group">
                  <label>Result</label>
                  <input
                    v-model="form[`${f.field}_result`]"
                    class="form-input"
                    placeholder="Enter result"
                  />
                </div>

                <!-- Value -->
                <div v-if="f.value" class="input-group">
                  <label>Value</label>
                  <input
                    v-model="form[`${f.field}_value`]"
                    type="number"
                    class="form-input"
                    placeholder="Enter value"
                  />
                </div>

                <!-- Remark -->
                <div v-if="f.remark" class="input-group">
                  <label>Remark</label>
                  <textarea
                    v-model="form[`${f.field}_remark`]"
                    class="form-input"
                    placeholder="Enter remark"
                    rows="3"
                  />
                </div>
              </div>
            </transition>
          </div>
        </div>
      </transition>
    </div>

    <div class="submit-container">
      <button type="submit" class="submit-btn">Submit</button>
    </div>
  </form>
</template>

<style scoped>
/* Section Card */
.section-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f8f9fa;
  cursor: pointer;
  user-select: none;
  border-bottom: 1px solid #e9ecef;
}

.section-header:hover {
  background: #e9ecef;
}

.section-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #212529;
}

/* Card Content Container */
.card-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Field Cards */
.field-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.field-card:hover {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: white;
  cursor: pointer;
  user-select: none;
  border-bottom: 1px solid #e9ecef;
}

.card-header:hover {
  background: #f8f9fa;
}

.card-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #495057;
}

.field-content {
  padding: 16px;
  background: white;
}

/* Toggle Buttons */
.toggle-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: #007bff;
  color: white;
  border-radius: 50%;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease, transform 0.2s ease;
}

.toggle-btn:hover {
  background: #0056b3;
  transform: scale(1.1);
}

.toggle-btn-small {
  width: 24px;
  height: 24px;
  border: none;
  background: #6c757d;
  color: white;
  border-radius: 50%;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease, transform 0.2s ease;
}

.toggle-btn-small:hover {
  background: #5a6268;
  transform: scale(1.1);
}

/* Form Groups */
.box {
  padding: 0;
}

.card {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  padding: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-weight: 500;
  color: #495057;
  font-size: 0.9rem;
}

.form-group input,
.form-group select {
  padding: 10px 12px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

/* Input Groups in Field Cards */
.input-group {
  margin-bottom: 14px;
}

.input-group:last-child {
  margin-bottom: 0;
}

.input-group label {
  display: block;
  font-weight: 500;
  color: #495057;
  font-size: 0.9rem;
  margin-bottom: 6px;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

textarea.form-input {
  resize: vertical;
  min-height: 80px;
}

/* Submit Button */
.submit-container {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

.submit-btn {
  padding: 12px 48px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

.submit-btn:hover {
  background: #218838;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
}

.submit-btn:active {
  transform: translateY(0);
}

/* Required Indicator */
.text-red-500 {
  color: #dc3545;
  margin-left: 4px;
}

/* Slide Transition */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  max-height: 2000px;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .card {
    grid-template-columns: 1fr;
  }

  .section-header h2 {
    font-size: 1.1rem;
  }

  .card-header h3 {
    font-size: 0.95rem;
  }
}
</style>