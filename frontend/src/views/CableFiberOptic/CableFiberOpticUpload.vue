<script setup lang="ts">
import { ref } from 'vue'
import {CableFiberOpticManage} from "../../services/CableFiberOptic/CableFiberOpticManage.api";

const selectedFile = ref<File | null>(null)

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement

    if (target.files && target.files.length > 0) {
        selectedFile.value = target.files[0]
    }
}

const uploadFile = async () => {
    if (!selectedFile.value) {
        alert('Please select KML/KMZ file')
        return
    }

    try {
        // TODO: replace API URL
        const response = await CableFiberOpticManage.UploadCalbe(selectedFile.value);

        if (!response.ok) {
            throw new Error('Upload failed')
        }

        alert('Upload success')
    } catch (error) {
        console.error(error)
        alert('Upload error')
    }
}
</script>

<template>
    <div class="container">
        <div class="card">
            <h1>Cable Fiber Optic Upload</h1>

            <p class="description">
                Upload KML / KMZ file into GIS Database
            </p>

            <input
                type="file"
                accept=".kml,.kmz"
                @change="handleFileChange"
            >

            <div v-if="selectedFile" class="file-info">
                Selected File:
                <strong>{{ selectedFile.name }}</strong>
            </div>

            <button @click="uploadFile">
                Upload
            </button>
        </div>
    </div>
</template>

<style scoped>
.container {
    display: flex;
    justify-content: center;
    padding: 40px;
}

.card {
    width: 500px;
    padding: 24px;
    border: 1px solid #ddd;
    border-radius: 12px;
    background: #fff;
}

h1 {
    margin-bottom: 12px;
}

.description {
    margin-bottom: 20px;
    color: #666;
}

input {
    margin-bottom: 16px;
}

.file-info {
    margin-bottom: 16px;
}

button {
    padding: 10px 16px;
    cursor: pointer;
}
</style>