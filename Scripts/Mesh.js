export class Mesh {

    constructor(options = {}) {
        this.primitives = [...(options.primitives ?? [])];
    }
    getVertices() {
        // Iterate over all primitives in the mesh
        for (const primitive of this.primitives) {
          // Check if the primitive has a POSITION attribute
          if (primitive.attributes.POSITION) {
            // Get the accessor for the POSITION attribute
            const positionAccessor = primitive.attributes.POSITION;
            // Get the buffer view for the accessor
            const positionBufferView = positionAccessor.bufferView;
            // Get the buffer for the buffer view
            const positionBuffer = positionBufferView.buffer;
            // Get the array of vertices from the buffer
            const vertices = new Float32Array(positionBuffer.data, positionBufferView.byteOffset, positionBufferView.byteLength / 4);
            return vertices;
          }
        }
      }
}
