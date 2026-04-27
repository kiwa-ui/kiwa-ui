import { scaleLinear } from 'd3-scale'
import { extent, max as d3Max } from 'd3-array'
import { line, area, curveMonotoneX } from 'd3-shape'
import type { ScaleLinear } from 'd3-scale'

export type ChartDimensions = {
  width: number
  height: number
  padding?: { top?: number; right?: number; bottom?: number; left?: number }
}

export function createLinearScale(
  domain: [number, number],
  range: [number, number],
  options?: { nice?: boolean },
): ScaleLinear<number, number> {
  const s = scaleLinear().domain(domain).range(range)
  if (options?.nice) s.nice()
  return s
}

export function computeExtent(data: number[]): [number, number] {
  const [lo, hi] = extent(data)
  return [lo ?? 0, hi ?? 0]
}

export function computeMax(data: number[]): number {
  return d3Max(data) ?? 0
}

export function computeNiceTicks(
  domain: [number, number],
  count = 5,
): { niceMax: number; ticks: number[] } {
  const scale = createLinearScale(domain, [0, 1], { nice: true })
  const [, niceMax] = scale.domain() as [number, number]
  return { niceMax, ticks: scale.ticks(count) }
}

function buildScales(data: number[], dims: ChartDimensions) {
  const { width, height, padding = {} } = dims
  const { top: pt = 0, right: pr = 0, bottom: pb = 0, left: pl = 0 } = padding
  const [yMin, yMax] = computeExtent(data)

  const xScale = createLinearScale([0, data.length - 1], [pl, width - pr])
  const yScale = createLinearScale(
    [yMin, yMax === yMin ? yMin + 1 : yMax],
    [height - pb, pt],
  )

  return { xScale, yScale }
}

export function generateLinePath(
  data: number[],
  dims: ChartDimensions,
): string {
  if (data.length === 0) return ''
  if (data.length === 1) {
    const { width, height, padding = {} } = dims
    const { left: pl = 0 } = padding
    return `M${pl + (width - pl) / 2},${height / 2}`
  }

  const { xScale, yScale } = buildScales(data, dims)

  const lineGenerator = line<number>()
    .x((_, i) => xScale(i))
    .y((d) => yScale(d))
    .curve(curveMonotoneX)

  return lineGenerator(data) ?? ''
}

export function generateAreaPath(
  data: number[],
  dims: ChartDimensions,
): { linePath: string; areaPath: string } {
  if (data.length === 0) return { linePath: '', areaPath: '' }

  const { height, padding = {} } = dims
  const { bottom: pb = 0 } = padding
  const { xScale, yScale } = buildScales(data, dims)

  const lineGenerator = line<number>()
    .x((_, i) => xScale(i))
    .y((d) => yScale(d))
    .curve(curveMonotoneX)

  const areaGenerator = area<number>()
    .x((_, i) => xScale(i))
    .y0(height - pb)
    .y1((d) => yScale(d))
    .curve(curveMonotoneX)

  return {
    linePath: lineGenerator(data) ?? '',
    areaPath: areaGenerator(data) ?? '',
  }
}

export function generateLinePathFromScales(
  data: number[],
  xScale: ScaleLinear<number, number>,
  yScale: ScaleLinear<number, number>,
): string {
  if (data.length === 0) return ''

  const lineGenerator = line<number>()
    .x((_, i) => xScale(i))
    .y((d) => yScale(d))
    .curve(curveMonotoneX)

  return lineGenerator(data) ?? ''
}

export type RadarPoint = { x: number; y: number }

export function generateRadarPoints(
  values: number[],
  maxValue: number,
  cx: number,
  cy: number,
  radius: number,
): RadarPoint[] {
  const count = values.length
  const angleStep = (2 * Math.PI) / count

  return values.map((value, i) => {
    const angle = angleStep * i - Math.PI / 2
    const r = (value / maxValue) * radius
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
  })
}

export function radarPointsToPath(points: RadarPoint[], close = true): string {
  if (points.length === 0) return ''
  const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  return close ? `${d} Z` : d
}

export function generateRadarGridRing(
  count: number,
  cx: number,
  cy: number,
  radius: number,
): string {
  const angleStep = (2 * Math.PI) / count
  const points = Array.from({ length: count }, (_, i) => {
    const angle = angleStep * i - Math.PI / 2
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) }
  })
  return radarPointsToPath(points, true)
}

export function generateDonutSegments(
  values: number[],
  radius: number,
): Array<{ dashArray: string; dashOffset: number; percentage: number }> {
  const total = values.reduce((sum, v) => sum + v, 0)
  if (total === 0) {
    return values.map(() => ({ dashArray: '0 0', dashOffset: 0, percentage: 0 }))
  }

  const circumference = 2 * Math.PI * radius
  let currentOffset = 0

  return values.map((value) => {
    const percentage = value / total
    const dashLength = circumference * percentage
    const gapLength = circumference - dashLength
    const result = {
      dashArray: `${dashLength} ${gapLength}`,
      dashOffset: -currentOffset,
      percentage,
    }
    currentOffset += dashLength
    return result
  })
}
