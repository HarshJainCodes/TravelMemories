import { Ref } from "vue"

export type tripData = {
    tripTitle: string,
    email: string,
    year: number,
    lat: number,
    lon: number,
    imageUrls: Array<string>
}

export type tripUploadPayload = {
    tripTitle: Ref<string>,
    tripYear: Ref<number>,
    locationCoords: Ref<{ lat: number, lon: number }>,
    selectedFiles: Ref<File[]>
}

export type tripOnMap = {
    tripTitle: string,
    email: string,
    year: number,
    lat: number,
    lon: number,
    imageUrls: Array<string>,
    x: number,
    y: number,
}