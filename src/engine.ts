
enum Letter_Type {
  None,
  O
}

enum Brick_Type {
  None,
  Red,
  Blue
}

export const Global_Scale = 4

const Brick_Width = 15
const Brick_Height = 7
const Cell_Width = 16
const Cell_Height = 8
const Circle_Size = 7
const Level_X_Offset = 8
const Level_Y_Offset = 6

const Platforma_Inner_Width = 21;

const Level_01 = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]

const get_brick_letter_color = (is_switch_color: boolean) => {
  if (is_switch_color) {
    return {
      front_pen: "rgb(255, 85, 85)",
      front_brush: "rgb(255, 85, 85)",
      back_pen: "rgb(68, 239, 255)",
      back_brush: "rgb(68, 239, 255)",
    }
  } else {
    return {
      front_pen: "rgb(68, 239, 255)",
      front_brush: "rgb(68, 239, 255)",
      back_pen: "rgb(255, 85, 85)",
      back_brush: "rgb(255, 85, 85)",
    }
  }
}

const number_complete_revolutions = 2
const number_movements = 8
const number_all_revolutions = number_complete_revolutions * number_movements

const calc_rotation_step = (rotation_step: number) => rotation_step % number_all_revolutions

const calc_brick_half_height = () => Brick_Height * Global_Scale / 2

const is_end_draw_brick_letter = (brick_type: Brick_Type) => (
  !(brick_type === Brick_Type.Blue || brick_type === Brick_Type.Red)
)

const get_rotation_angle = (rotation_step: number) => {
  return rotation_step < number_movements
    ? number_complete_revolutions * Math.PI / number_all_revolutions * rotation_step
    : number_complete_revolutions * Math.PI / number_all_revolutions * (number_movements - rotation_step)
}

type Draw_Brick_Letter_Props = {
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  brick_type: Brick_Type,
  letter_type: Letter_Type,
  rotation_step: number
}

const get_all_frames_when_block_turned_edgewise = () => {
  const first_step = number_movements / 2
  const result = [first_step]

  while (result[result.length - 1] + number_movements < number_all_revolutions) {
    result.push(result[result.length - 1] + number_movements)
  }

  return result
}

const is_frame_back_side_block = (all_frames: number[], rotation_step: number) => {
  return all_frames
    .reduce((frames, current_frame, current_index, array) => {
      if (array[current_index + 1] === undefined) return frames

      frames.push(
        rotation_step > current_frame && rotation_step <= array[current_index + 1]
      )

      return frames
    }, [] as boolean[])
    .includes(true)
}

const get_is_switch_color = (all_frames: number[], rotation_step: number, brick_type: Brick_Type) => {
  return is_frame_back_side_block(all_frames, rotation_step)
    ? brick_type === Brick_Type.Blue
    : brick_type !== Brick_Type.Blue
}

const draw_brick = (context: CanvasRenderingContext2D, x: number, y: number, brick_type: Brick_Type) => {
  if (brick_type === Brick_Type.None) return

  const brick_colors = {
    [Brick_Type.Red]: {
      pen: "rgb(255, 85, 85)",
      brush: "rgb(255, 85, 85)"
    },
    [Brick_Type.Blue]: {
      pen: "rgb(68, 239, 255)",
      brush: "rgb(68, 239, 255)"
    },
  }

  context.strokeStyle = brick_colors[brick_type].pen
  context.fillStyle = brick_colors[brick_type].brush

  context.beginPath();
  context.roundRect(
    x * Global_Scale,
    y * Global_Scale,
    (Brick_Width) * Global_Scale,
    (Brick_Height) * Global_Scale,
    2 * Global_Scale,
  )
  context.fill();
  context.stroke();
}

const draw_level = (context: CanvasRenderingContext2D) => {
  let i, j

  for (i = 0; i < 14; i++) {
    for (j = 0; j < 12; j++) {
      draw_brick(
        context,
        Level_X_Offset + j * Cell_Width,
        Level_Y_Offset + i * Cell_Height,
        Level_01[i][j]
      )
    }
  }
}

const draw_brick_letter = ({ context, ...other }: Draw_Brick_Letter_Props) => {
  if (is_end_draw_brick_letter(other.brick_type)) return;

  const brick_half_height = calc_brick_half_height();
  const rotation_step = calc_rotation_step(other.rotation_step);
  const rotation_angle = get_rotation_angle(rotation_step)

  const all_frames_when_block_turned_edgewise = get_all_frames_when_block_turned_edgewise()
  const switch_color = get_is_switch_color(all_frames_when_block_turned_edgewise, rotation_step, other.brick_type)
  const brick_letter_color = get_brick_letter_color(switch_color)

  if (all_frames_when_block_turned_edgewise.includes(rotation_step)) {
    context.strokeStyle = brick_letter_color.back_pen
    context.fillStyle = brick_letter_color.back_brush

    context.fillRect(
      other.x,
      other.y + brick_half_height - Global_Scale,
      Brick_Width * Global_Scale,
      Global_Scale
    );

    context.strokeStyle = brick_letter_color.front_pen
    context.fillStyle = brick_letter_color.front_brush

    context.fillRect(
      other.x,
      other.y + brick_half_height,
      Brick_Width * Global_Scale,
      Global_Scale - 1
    );
  } else {
    context.save();

    context.transform(1, 0, 0, Math.cos(rotation_angle), other.x, other.y + brick_half_height);

    const offset = 3 * (1 - Math.abs(Math.cos(rotation_angle))) * Global_Scale;
    const back_part_offset = Math.round(offset);

    context.strokeStyle = brick_letter_color.back_pen
    context.fillStyle = brick_letter_color.back_brush

    context.fillRect(
      0,
      0 - brick_half_height - back_part_offset,
      Brick_Width * Global_Scale,
      Brick_Height * Global_Scale
    );

    context.strokeStyle = brick_letter_color.front_pen
    context.fillStyle = brick_letter_color.front_brush

    context.fillRect(
      0,
      0 - brick_half_height,
      Brick_Width * Global_Scale,
      Brick_Height * Global_Scale
    );

    if (
      is_frame_back_side_block(all_frames_when_block_turned_edgewise, rotation_step) &&
      other.letter_type === Letter_Type.O
    ) {
      context.strokeStyle = "white";
      context.lineWidth = Global_Scale - 1
      context.beginPath();
      context.ellipse(
        0 + 7.5 * Global_Scale,
        0,
        2.5 * Global_Scale,
        2.5 * Global_Scale,
        0,
        0,
        2 * Math.PI
      );
      context.stroke();
    }

    context.restore();
  }
};

const draw_platforma = (context: CanvasRenderingContext2D, x: number, y: number) => {
  context.strokeStyle = "rgb(151, 0, 0)"
  context.fillStyle = "rgb(151, 0, 0)"

  const circle_radius = Circle_Size / 2

  context.beginPath()
  context.ellipse(
    (x + circle_radius) * Global_Scale,
    (y + circle_radius) * Global_Scale,
    circle_radius * Global_Scale,
    circle_radius * Global_Scale,
    0,
    0,
    2 * Math.PI
  )
  context.fill()
  context.stroke()

  context.beginPath()
  context.ellipse(
    (x + circle_radius + Platforma_Inner_Width) * Global_Scale,
    (y + circle_radius) * Global_Scale,
    circle_radius * Global_Scale,
    circle_radius * Global_Scale,
    0,
    0,
    2 * Math.PI
  )
  context.fill()
  context.stroke()

  context.strokeStyle = "rgb(255, 255, 255)"
  context.beginPath()
  context.arc(
    (x + circle_radius) * Global_Scale,
    (y + circle_radius) * Global_Scale,
    (circle_radius - 1) * Global_Scale,
    Math.PI,
    1.4 * Math.PI,
    false
  )
  context.stroke()

  context.strokeStyle = "rgb(0, 128, 192)"
  context.fillStyle = "rgb(0, 128, 192)"

  context.beginPath();
  context.roundRect(
    (x + 4) * Global_Scale,
    (y + 1) * Global_Scale,
    (Platforma_Inner_Width - 1) * Global_Scale,
    5 * Global_Scale,
    3 * Global_Scale
  )
  context.closePath();

  context.fill();
  context.stroke();

  // Блики на внутренней части платформы
  context.strokeStyle = "rgb(255, 255, 255)"
  context.lineWidth = 1
  context.beginPath()

  context.moveTo((x + 6) * Global_Scale, (y + 2) * Global_Scale)
  context.lineTo((x + 6 + 4) * Global_Scale, (y + 2) * Global_Scale)

  context.moveTo((x + 11) * Global_Scale, (y + 2) * Global_Scale)
  context.lineTo((x + 11 + 3) * Global_Scale, (y + 2) * Global_Scale)

  context.moveTo((x + 15) * Global_Scale, (y + 2) * Global_Scale)
  context.lineTo((x + 15 + 1) * Global_Scale, (y + 2) * Global_Scale)

  context.stroke()
}

export const draw_frame = (context: CanvasRenderingContext2D) => {
  // draw_level(context)
  draw_platforma(context, 50, 150)

  let i = 0;
  for (i = 0; i < number_all_revolutions; i++) {
    draw_brick_letter({
      context,
      x: 20 + i * Cell_Width * Global_Scale,
      y: 100,
      brick_type: Brick_Type.Blue,
      letter_type: Letter_Type.O,
      rotation_step: i
    })

    draw_brick_letter({
      context,
      x: 20 + i * Cell_Width * Global_Scale,
      y: 140,
      brick_type: Brick_Type.Red,
      letter_type: Letter_Type.O,
      rotation_step: i
    })
  }
}