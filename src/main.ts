import "./style.css"
import { draw_frame, Global_Scale } from "./engine"

const window_width = 320
const window_height = 200

const popcorn_canvas = document.createElement("canvas")

popcorn_canvas.width = window_width * Global_Scale
popcorn_canvas.height = window_height * Global_Scale

popcorn_canvas.style.backgroundColor = "rgb(15, 63, 31)"

const popcorn_canvas_context = popcorn_canvas.getContext("2d") as CanvasRenderingContext2D

const root = document.querySelector("#app") as HTMLDivElement

root.appendChild(popcorn_canvas)

draw_frame(popcorn_canvas_context)