<script setup lang="ts">
import { onMounted, ref } from "vue";
import { PMApiService } from "../../services/pm_nodeb.api";
import { getRectifierConfig } from "../../services/pmConfig.api";

const fields = ref<any[]>([]);
const form = ref<Record<string, any>>({});
const expandedCards = ref<Record<string, boolean>>({});

interface RectifierField {
  field: string;
  label: string;
  result: boolean;
  value: boolean;
  remark: boolean;
  img?: string;
  required: boolean;
}

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

// สำหรับซ่อน/แสดง PM Information section
const showPmInfo = ref(true);
// สำหรับซ่อน/แสดง Field Cards ทั้งหมด
const showAllFields = ref(true);

onMounted(async () => {
  const res = await getRectifierConfig();

  fields.value = res.fields.filter((f: RectifierField) => f.result === true);

  // กำหนดค่าเริ่มต้นให้แต่ละ card ขยายออก
  fields.value.forEach((f) => {
    expandedCards.value[f.field] = true;
    
    if (f.result) form.value[`${f.field}_result`] = "";
    if (f.value) form.value[`${f.field}_value`] = "";
    if (f.remark) form.value[`${f.field}_remark`] = "";
  });
});

const toggleCard = (fieldName: string) => {
  expandedCards.value[fieldName] = !expandedCards.value[fieldName];
};

const togglePmInfo = () => {
  showPmInfo.value = !showPmInfo.value;
};

// ฟังก์ชันซ่อน/แสดงทั้งหมด
const toggleAllFields = () => {
  showAllFields.value = !showAllFields.value;
  // ถ้าแสดงทั้งหมด ให้เปิดทุก card, ถ้าซ่อนทั้งหมด ให้ปิดทุก card
  fields.value.forEach((f) => {
    expandedCards.value[f.field] = showAllFields.value;
  });
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

    <!-- Field Cards Section with Toggle All Button -->
    <div class="section-card">
      <div class="section-header" @click="toggleAllFields">
        <h2>Rectifier</h2>
        <button type="button" class="toggle-btn">
          {{ showAllFields ? "−" : "+" }}
        </button>
      </div>

      <transition name="slide">
        <div v-show="showAllFields" class="card-content">
          <div v-for="f in fields" :key="f.field" class="field-card">
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