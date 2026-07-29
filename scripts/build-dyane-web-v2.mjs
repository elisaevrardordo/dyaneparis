import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const sourcePath = path.resolve(process.argv[2] || 'public/models/dyane.glb')
const destinationPath = path.resolve(process.argv[3] || 'public/models/dyane-web-v2.glb')

if (sourcePath === destinationPath) {
  throw new Error('The V2 destination must differ from the original GLB path.')
}

const sourceBytes = fs.readFileSync(sourcePath)
const sourceHash = crypto.createHash('sha256').update(sourceBytes).digest('hex')

function parseGlb(bytes) {
  if (bytes.readUInt32LE(0) !== 0x46546c67 || bytes.readUInt32LE(4) !== 2) {
    throw new Error('Expected a binary glTF 2.0 file.')
  }

  const jsonLength = bytes.readUInt32LE(12)
  const json = JSON.parse(bytes.subarray(20, 20 + jsonLength).toString('utf8').trimEnd())
  const binaryHeaderOffset = 20 + ((jsonLength + 3) & ~3)
  const binaryLength = bytes.readUInt32LE(binaryHeaderOffset)
  const binary = bytes.subarray(binaryHeaderOffset + 8, binaryHeaderOffset + 8 + binaryLength)
  return { json, binary }
}

function readAccessor(json, binary, accessorIndex) {
  const accessor = json.accessors[accessorIndex]
  const view = json.bufferViews[accessor.bufferView]
  const components = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 }[accessor.type]
  const componentSize = { 5121: 1, 5123: 2, 5125: 4, 5126: 4 }[accessor.componentType]
  const ArrayType = { 5121: Uint8Array, 5123: Uint16Array, 5125: Uint32Array, 5126: Float32Array }[
    accessor.componentType
  ]
  if (!components || !componentSize || !ArrayType || view.byteStride) {
    throw new Error(`Unsupported accessor layout at index ${accessorIndex}.`)
  }
  const byteOffset = (view.byteOffset || 0) + (accessor.byteOffset || 0)
  return new ArrayType(binary.buffer, binary.byteOffset + byteOffset, accessor.count * components)
}

function triangleArea(positions, a, b, c) {
  const ax = positions[a * 3]
  const ay = positions[a * 3 + 1]
  const az = positions[a * 3 + 2]
  const abx = positions[b * 3] - ax
  const aby = positions[b * 3 + 1] - ay
  const abz = positions[b * 3 + 2] - az
  const acx = positions[c * 3] - ax
  const acy = positions[c * 3 + 1] - ay
  const acz = positions[c * 3 + 2] - az
  const cx = aby * acz - abz * acy
  const cy = abz * acx - abx * acz
  const cz = abx * acy - aby * acx
  return 0.5 * Math.hypot(cx, cy, cz)
}

function appendAligned(chunks, value) {
  const source = Buffer.from(value.buffer, value.byteOffset, value.byteLength)
  const previousLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0)
  const padding = (4 - (previousLength % 4)) % 4
  if (padding) chunks.push(Buffer.alloc(padding))
  const offset = previousLength + padding
  chunks.push(source)
  return offset
}

function makeGlb(json, binary) {
  const jsonRaw = Buffer.from(JSON.stringify(json))
  const jsonPadding = (4 - (jsonRaw.length % 4)) % 4
  const jsonChunk = Buffer.concat([jsonRaw, Buffer.alloc(jsonPadding, 0x20)])
  const binaryPadding = (4 - (binary.length % 4)) % 4
  const binaryChunk = Buffer.concat([binary, Buffer.alloc(binaryPadding)])
  const output = Buffer.alloc(12 + 8 + jsonChunk.length + 8 + binaryChunk.length)
  output.writeUInt32LE(0x46546c67, 0)
  output.writeUInt32LE(2, 4)
  output.writeUInt32LE(output.length, 8)
  output.writeUInt32LE(jsonChunk.length, 12)
  output.writeUInt32LE(0x4e4f534a, 16)
  jsonChunk.copy(output, 20)
  const binaryHeaderOffset = 20 + jsonChunk.length
  output.writeUInt32LE(binaryChunk.length, binaryHeaderOffset)
  output.writeUInt32LE(0x004e4942, binaryHeaderOffset + 4)
  binaryChunk.copy(output, binaryHeaderOffset + 8)
  return output
}

const { json: originalJson, binary: originalBinary } = parseGlb(sourceBytes)
const json = structuredClone(originalJson)

const requiredNodeNames = ['body', 'body.001', 'cap', 'scarf']
for (const name of requiredNodeNames) {
  if (!json.nodes.some((node) => node.name === name)) throw new Error(`Required node ${name} is missing.`)
}

const signatureNode = json.nodes.find((node) => node.name === 'body.001')
const signaturePrimitive = json.meshes[signatureNode.mesh].primitives[0]
const signatureAttributeAccessors = { ...signaturePrimitive.attributes }
const signaturePositions = readAccessor(json, originalBinary, signaturePrimitive.attributes.POSITION)
const signatureIndices = readAccessor(json, originalBinary, signaturePrimitive.indices)
const cleanSignatureIndices = []
let removedDegenerateTriangles = 0

for (let offset = 0; offset < signatureIndices.length; offset += 3) {
  const a = signatureIndices[offset]
  const b = signatureIndices[offset + 1]
  const c = signatureIndices[offset + 2]
  if (triangleArea(signaturePositions, a, b, c) <= 1e-12) {
    removedDegenerateTriangles++
    continue
  }
  cleanSignatureIndices.push(a, b, c)
}

const binaryChunks = []
const bufferViews = []
const accessors = []
const accessorMap = new Map()

function copyAccessor(oldAccessorIndex) {
  if (accessorMap.has(oldAccessorIndex)) return accessorMap.get(oldAccessorIndex)
  const oldAccessor = originalJson.accessors[oldAccessorIndex]
  const oldView = originalJson.bufferViews[oldAccessor.bufferView]
  if (oldAccessor.sparse || oldView.byteStride) {
    throw new Error(`Sparse or interleaved accessor ${oldAccessorIndex} is outside the safe rewrite scope.`)
  }
  const start = (oldView.byteOffset || 0) + (oldAccessor.byteOffset || 0)
  const byteLength = oldView.byteLength - (oldAccessor.byteOffset || 0)
  const raw = originalBinary.subarray(start, start + byteLength)
  const byteOffset = appendAligned(binaryChunks, raw)
  const newBufferViewIndex = bufferViews.length
  bufferViews.push({ buffer: 0, byteOffset, byteLength: raw.length, target: oldView.target })
  const newAccessorIndex = accessors.length
  accessors.push({ ...oldAccessor, bufferView: newBufferViewIndex, byteOffset: 0 })
  accessorMap.set(oldAccessorIndex, newAccessorIndex)
  return newAccessorIndex
}

function appendAccessorData(data, templateAccessor, target) {
  const byteOffset = appendAligned(binaryChunks, data)
  const bufferView = bufferViews.length
  bufferViews.push({ buffer: 0, byteOffset, byteLength: data.byteLength, target })
  const accessor = accessors.length
  const nextAccessor = {
    ...templateAccessor,
    bufferView,
    byteOffset: 0,
    count: data.length / ({ SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 }[templateAccessor.type]),
  }
  delete nextAccessor.max
  delete nextAccessor.min
  accessors.push(nextAccessor)
  return accessor
}

for (const mesh of json.meshes) {
  for (const primitive of mesh.primitives) {
    if (primitive === signaturePrimitive) continue
    primitive.attributes = Object.fromEntries(
      Object.entries(primitive.attributes).map(([semantic, accessor]) => [semantic, copyAccessor(accessor)]),
    )
    if (primitive !== signaturePrimitive) primitive.indices = copyAccessor(primitive.indices)
  }
}

const usedSignatureVertices = [...new Set(cleanSignatureIndices)].sort((a, b) => a - b)
const signatureRemap = new Map(usedSignatureVertices.map((vertex, index) => [vertex, index]))
signaturePrimitive.attributes = Object.fromEntries(
  Object.entries(signatureAttributeAccessors).map(([semantic, oldAccessorIndex]) => {
    const template = originalJson.accessors[oldAccessorIndex]
    const values = readAccessor(originalJson, originalBinary, oldAccessorIndex)
    const componentCount = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 }[template.type]
    const compact = new values.constructor(usedSignatureVertices.length * componentCount)
    usedSignatureVertices.forEach((oldVertex, newVertex) => {
      for (let component = 0; component < componentCount; component++) {
        compact[newVertex * componentCount + component] = values[oldVertex * componentCount + component]
      }
    })
    const accessor = appendAccessorData(compact, template, 34962)
    if (semantic === 'POSITION') {
      accessors[accessor].min = [...template.min]
      accessors[accessor].max = [...template.max]
    }
    return [semantic, accessor]
  }),
)

const cleanIndexArray = Uint16Array.from(cleanSignatureIndices.map((index) => signatureRemap.get(index)))
const cleanIndexOffset = appendAligned(binaryChunks, cleanIndexArray)
const cleanIndexView = bufferViews.length
bufferViews.push({
  buffer: 0,
  byteOffset: cleanIndexOffset,
  byteLength: cleanIndexArray.byteLength,
  target: 34963,
})
signaturePrimitive.indices = accessors.length
accessors.push({
  bufferView: cleanIndexView,
  byteOffset: 0,
  componentType: 5123,
  count: cleanIndexArray.length,
  type: 'SCALAR',
})

json.accessors = accessors
json.bufferViews = bufferViews

const linear = (hex) => {
  const channel = Number.parseInt(hex, 16) / 255
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
}
const color = (hex) => [linear(hex.slice(1, 3)), linear(hex.slice(3, 5)), linear(hex.slice(5, 7)), 1]
const pbr = (name, baseColorFactor, roughnessFactor, doubleSided = true, extras = undefined) => ({
  name,
  doubleSided,
  pbrMetallicRoughness: { baseColorFactor, metallicFactor: 0, roughnessFactor },
  ...(extras ? { extras } : {}),
})

json.materials = [
  pbr('Porcelain_Ivory', color('#f4ead9'), 0.24, true),
  pbr('Glaze_Bordeaux', color('#82142a'), 0.165, true),
  pbr('Porcelain_Base', color('#efe5d5'), 0.3, true, {
    reserved: true,
    note: 'Reserved until the base is manually separated from body without changing the sculpture.',
  }),
  pbr('Porcelain_Cap', color('#f4ead9'), 0.255, false),
  pbr('Signature_Dark', color('#302824'), 0.46, true),
]

const materialByNode = {
  scarf: 1,
  cap: 3,
  body: 0,
  'body.001': 4,
}
for (const node of json.nodes) {
  if (node.mesh === undefined) continue
  for (const primitive of json.meshes[node.mesh].primitives) {
    primitive.material = materialByNode[node.name]
  }
}

json.meshes[json.nodes.find((node) => node.name === 'scarf').mesh].name = 'Scarf_Geometry'
json.meshes[json.nodes.find((node) => node.name === 'cap').mesh].name = 'Cap_Geometry'
json.meshes[json.nodes.find((node) => node.name === 'body').mesh].name = 'Body_Geometry'
json.meshes[signatureNode.mesh].name = 'Signature_Geometry'

const shift = [-0.013677075505256653, -0.013805031776428223, 0.0009306963884830475]
const originalSceneNodes = [...json.scenes[json.scene || 0].nodes]
const rootIndex = json.nodes.length
json.nodes.push({
  name: 'Dyane_Root',
  translation: shift,
  children: originalSceneNodes,
  extras: {
    pivot: 'centered on X/Z; base aligned to Y=0',
    sourceSha256: sourceHash,
  },
})
json.scenes[json.scene || 0].nodes = [rootIndex]

json.asset = {
  version: '2.0',
  generator: 'Dyane Web V2 safe GLB repacker',
  copyright: originalJson.asset?.copyright,
}
json.extras = {
  ...(json.extras || {}),
  dyaneWebV2: {
    sourceSha256: sourceHash,
    preservedNodes: requiredNodeNames,
    removedDegenerateTriangles,
    removedUnreferencedSignatureVertices: signaturePositions.length / 3 - usedSignatureVertices.length,
    geometryPolicy:
      'No subdivision, welding or smoothing. All non-signature attributes copied byte-for-byte; signature values compacted without numeric changes.',
  },
}

const binary = Buffer.concat(binaryChunks)
json.buffers = [{ byteLength: binary.length }]
const output = makeGlb(json, binary)
fs.mkdirSync(path.dirname(destinationPath), { recursive: true })
fs.writeFileSync(destinationPath, output)

console.log(
  JSON.stringify(
    {
      source: sourcePath,
      destination: destinationPath,
      sourceSha256: sourceHash,
      sourceBytes: sourceBytes.length,
      destinationBytes: output.length,
      removedDegenerateTriangles,
      nodes: json.nodes.map((node) => node.name),
      materials: json.materials.map((material) => material.name),
    },
    null,
    2,
  ),
)
