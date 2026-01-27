<script setup lang="ts">
import { ref } from "vue";
import { PMApiService } from "../../services/pm_nodeb.api";

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
    remark.value,
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
    <label>PM Information</label>
    <div class="box">
      <div class="card">
        <div>
          <label>Site ID :</label>
          <input v-model="site_id" type="text" name="site_id" required />
        </div>

        <div>
          <label>Node Type</label>
          <select v-model="node_type" name="node_type" id="">
            <option value="">Select...</option>
            <option value="NodeB">NodeB</option>
            <option value="SmallExchange">Small Exchange</option>
            <option value="MediumExchange">Medium Exchange</option>
            <option value="Boardband">Boardband</option>
            <option value="Mowing">Mowing</option>
            <option value="SolarCell">Solar Cell</option>
          </select>
        </div>

        <div>
          <label>Round :</label>
          <input v-model="round" type="text" name="round" />
        </div>

        <div>
          <label>Cabinet Total :</label>
          <input v-model="cabinet_total" type="text" name="cabinet_total" />
        </div>

        <div>
          <label>Region</label>
          <input v-model="region" type="text" name="region" />
        </div>

        <div>
          <label>PM Date</label>
          <input v-model="datetime" type="datetime-local" name="datetime" />
        </div>

        <div>
          <label>Site Status</label>
          <input v-model="status" type="text" name="status" />
        </div>

        <div>
          <label>Planwork</label>
          <input v-model="planwork" type="text" name="planwork" />
        </div>

        <div>
          <label>Created by</label>
          <input v-model="created_by" type="text" name="created_by" />
        </div>

        <div>
          <label>Remark</label>
          <input v-model="remark" type="text" name="remark" />
        </div>
      </div>
    </div>

    <button type="submit">
      submit
    </button>
  </form>
</template>