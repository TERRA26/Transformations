class cgIShape {
    constructor () {
        this.points = [];
        this.bary = [];
        this.indices = [];
    }
    
    addTriangle (x0,y0,z0,x1,y1,z1,x2,y2,z2) {
        var nverts = this.points.length / 4;
        
        // push first vertex
        this.points.push(x0);  this.bary.push (1.0);
        this.points.push(y0);  this.bary.push (0.0);
        this.points.push(z0);  this.bary.push (0.0);
        this.points.push(1.0);
        this.indices.push(nverts);
        nverts++;
        
        // push second vertex
        this.points.push(x1); this.bary.push (0.0);
        this.points.push(y1); this.bary.push (1.0);
        this.points.push(z1); this.bary.push (0.0);
        this.points.push(1.0);
        this.indices.push(nverts);
        nverts++
        
        // push third vertex
        this.points.push(x2); this.bary.push (0.0);
        this.points.push(y2); this.bary.push (0.0);
        this.points.push(z2); this.bary.push (1.0);
        this.points.push(1.0);
        this.indices.push(nverts);
        nverts++;
    }
}

class Cube extends cgIShape {
    
    constructor (subdivisions) {
        super();
        this.makeCube (subdivisions);
    }
    
    makeCube (subdivisions)  {
        // Create cube with dimensions 1x1x1 (centered at origin)
        const step = 1.0 / subdivisions;

        // Front face (z = 0.5)
        for (let i = 0; i < subdivisions; i++) {
            for (let j = 0; j < subdivisions; j++) {
                let x1 = -0.5 + i * step;
                let x2 = -0.5 + (i + 1) * step;
                let y1 = -0.5 + j * step;
                let y2 = -0.5 + (j + 1) * step;

                this.addTriangle(x1, y1, 0.5, x2, y1, 0.5, x2, y2, 0.5);
                this.addTriangle(x1, y1, 0.5, x2, y2, 0.5, x1, y2, 0.5);
            }
        }

        // Back face (z = -0.5)
        for (let i = 0; i < subdivisions; i++) {
            for (let j = 0; j < subdivisions; j++) {
                let x1 = -0.5 + i * step;
                let x2 = -0.5 + (i + 1) * step;
                let y1 = -0.5 + j * step;
                let y2 = -0.5 + (j + 1) * step;

                this.addTriangle(x2, y1, -0.5, x1, y1, -0.5, x1, y2, -0.5);
                this.addTriangle(x2, y1, -0.5, x1, y2, -0.5, x2, y2, -0.5);
            }
        }

        // Top face (y = 0.5)
        for (let i = 0; i < subdivisions; i++) {
            for (let j = 0; j < subdivisions; j++) {
                let x1 = -0.5 + i * step;
                let x2 = -0.5 + (i + 1) * step;
                let z1 = -0.5 + j * step;
                let z2 = -0.5 + (j + 1) * step;

                this.addTriangle(x1, 0.5, z2, x2, 0.5, z2, x2, 0.5, z1);
                this.addTriangle(x1, 0.5, z2, x2, 0.5, z1, x1, 0.5, z1);
            }
        }

        // Bottom face (y = -0.5)
        for (let i = 0; i < subdivisions; i++) {
            for (let j = 0; j < subdivisions; j++) {
                let x1 = -0.5 + i * step;
                let x2 = -0.5 + (i + 1) * step;
                let z1 = -0.5 + j * step;
                let z2 = -0.5 + (j + 1) * step;

                this.addTriangle(x1, -0.5, z1, x2, -0.5, z1, x2, -0.5, z2);
                this.addTriangle(x1, -0.5, z1, x2, -0.5, z2, x1, -0.5, z2);
            }
        }

        // Right face (x = 0.5)
        for (let i = 0; i < subdivisions; i++) {
            for (let j = 0; j < subdivisions; j++) {
                let z1 = -0.5 + i * step;
                let z2 = -0.5 + (i + 1) * step;
                let y1 = -0.5 + j * step;
                let y2 = -0.5 + (j + 1) * step;

                this.addTriangle(0.5, y1, z2, 0.5, y1, z1, 0.5, y2, z1);
                this.addTriangle(0.5, y1, z2, 0.5, y2, z1, 0.5, y2, z2);
            }
        }

        // Left face (x = -0.5)
        for (let i = 0; i < subdivisions; i++) {
            for (let j = 0; j < subdivisions; j++) {
                let z1 = -0.5 + i * step;
                let z2 = -0.5 + (i + 1) * step;
                let y1 = -0.5 + j * step;
                let y2 = -0.5 + (j + 1) * step;

                this.addTriangle(-0.5, y1, z1, -0.5, y1, z2, -0.5, y2, z2);
                this.addTriangle(-0.5, y1, z1, -0.5, y2, z2, -0.5, y2, z1);
            }
        }
    }
}


class Cylinder extends cgIShape {

    constructor (radialdivision,heightdivision) {
        super();
        this.makeCylinder (radialdivision,heightdivision);
    }
    
    makeCylinder (radialdivision,heightdivision){
        // Create cylinder with diameter 1, height 1 (centered at origin)
        const radius = 0.5;
        const angleStep = (2 * Math.PI) / radialdivision;
        const heightStep = 1.0 / heightdivision;

        // Create the cylinder body
        for (let i = 0; i < radialdivision; i++) {
            for (let j = 0; j < heightdivision; j++) {
                let angle1 = i * angleStep;
                let angle2 = (i + 1) * angleStep;
                let y1 = -0.5 + j * heightStep;
                let y2 = -0.5 + (j + 1) * heightStep;

                let x1 = radius * Math.cos(angle1);
                let z1 = radius * Math.sin(angle1);
                let x2 = radius * Math.cos(angle2);
                let z2 = radius * Math.sin(angle2);

                // Two triangles for each quad on the cylinder surface
                this.addTriangle(x1, y1, z1, x2, y1, z2, x2, y2, z2);
                this.addTriangle(x1, y1, z1, x2, y2, z2, x1, y2, z1);
            }
        }

        // Create the top cap (y = 0.5)
        for (let i = 0; i < radialdivision; i++) {
            let angle1 = i * angleStep;
            let angle2 = (i + 1) * angleStep;

            let x1 = radius * Math.cos(angle1);
            let z1 = radius * Math.sin(angle1);
            let x2 = radius * Math.cos(angle2);
            let z2 = radius * Math.sin(angle2);

            this.addTriangle(0, 0.5, 0, x1, 0.5, z1, x2, 0.5, z2);
        }

        // Create the bottom cap (y = -0.5)
        for (let i = 0; i < radialdivision; i++) {
            let angle1 = i * angleStep;
            let angle2 = (i + 1) * angleStep;

            let x1 = radius * Math.cos(angle1);
            let z1 = radius * Math.sin(angle1);
            let x2 = radius * Math.cos(angle2);
            let z2 = radius * Math.sin(angle2);

            this.addTriangle(0, -0.5, 0, x2, -0.5, z2, x1, -0.5, z1);
        }
    }
}

class Cone extends cgIShape {

    constructor (radialdivision, heightdivision) {
        super();
        this.makeCone (radialdivision, heightdivision);
    }
    
    
    makeCone (radialdivision, heightdivision) {
        // Create cone with diameter 1, height 1 (centered at origin)
        const baseRadius = 0.5;
        const angleStep = (2 * Math.PI) / radialdivision;
        const heightStep = 1.0 / heightdivision;

        // Create the cone surface
        for (let i = 0; i < radialdivision; i++) {
            for (let j = 0; j < heightdivision; j++) {
                let angle1 = i * angleStep;
                let angle2 = (i + 1) * angleStep;

                // Calculate heights and radii for this subdivision
                let y1 = -0.5 + j * heightStep;
                let y2 = -0.5 + (j + 1) * heightStep;

                // Radius decreases linearly from base to apex
                let r1 = baseRadius * (1 - (j / heightdivision));
                let r2 = baseRadius * (1 - ((j + 1) / heightdivision));

                let x1 = r1 * Math.cos(angle1);
                let z1 = r1 * Math.sin(angle1);
                let x2 = r1 * Math.cos(angle2);
                let z2 = r1 * Math.sin(angle2);
                let x3 = r2 * Math.cos(angle1);
                let z3 = r2 * Math.sin(angle1);
                let x4 = r2 * Math.cos(angle2);
                let z4 = r2 * Math.sin(angle2);

                // Don't add triangles for the tip (where radius is 0)
                if (j == heightdivision - 1) {
                    // Triangle to the apex
                    this.addTriangle(x1, y1, z1, x2, y1, z2, 0, 0.5, 0);
                } else {
                    // Two triangles for the trapezoid
                    this.addTriangle(x1, y1, z1, x2, y1, z2, x4, y2, z4);
                    this.addTriangle(x1, y1, z1, x4, y2, z4, x3, y2, z3);
                }
            }
        }

        // Create the base (y = -0.5)
        for (let i = 0; i < radialdivision; i++) {
            let angle1 = i * angleStep;
            let angle2 = (i + 1) * angleStep;

            let x1 = baseRadius * Math.cos(angle1);
            let z1 = baseRadius * Math.sin(angle1);
            let x2 = baseRadius * Math.cos(angle2);
            let z2 = baseRadius * Math.sin(angle2);

            this.addTriangle(0, -0.5, 0, x2, -0.5, z2, x1, -0.5, z1);
        }
    }
}
    
class Sphere extends cgIShape {

    constructor (slices, stacks) {
        super();
        this.makeSphere (slices, stacks);
    }
    
    makeSphere (slices, stacks) {
        // Create sphere with diameter 1 (centered at origin)
        const radius = 0.5;
        const phiStep = Math.PI / stacks;        // Latitude step
        const thetaStep = (2 * Math.PI) / slices; // Longitude step

        // Generate sphere using spherical coordinates
        for (let i = 0; i < stacks; i++) {
            let phi1 = i * phiStep;
            let phi2 = (i + 1) * phiStep;

            for (let j = 0; j < slices; j++) {
                let theta1 = j * thetaStep;
                let theta2 = (j + 1) * thetaStep;

                // Calculate vertices for the quad
                // Vertex 1: (phi1, theta1)
                let x1 = radius * Math.sin(phi1) * Math.cos(theta1);
                let y1 = radius * Math.cos(phi1);
                let z1 = radius * Math.sin(phi1) * Math.sin(theta1);

                // Vertex 2: (phi1, theta2)
                let x2 = radius * Math.sin(phi1) * Math.cos(theta2);
                let y2 = radius * Math.cos(phi1);
                let z2 = radius * Math.sin(phi1) * Math.sin(theta2);

                // Vertex 3: (phi2, theta1)
                let x3 = radius * Math.sin(phi2) * Math.cos(theta1);
                let y3 = radius * Math.cos(phi2);
                let z3 = radius * Math.sin(phi2) * Math.sin(theta1);

                // Vertex 4: (phi2, theta2)
                let x4 = radius * Math.sin(phi2) * Math.cos(theta2);
                let y4 = radius * Math.cos(phi2);
                let z4 = radius * Math.sin(phi2) * Math.sin(theta2);

                // Special case for poles to avoid degenerate triangles
                if (i == 0) {
                    // North pole - single triangle
                    this.addTriangle(x1, y1, z1, x4, y4, z4, x3, y3, z3);
                } else if (i == stacks - 1) {
                    // South pole - single triangle
                    this.addTriangle(x1, y1, z1, x2, y2, z2, x4, y4, z4);
                } else {
                    // Regular quad - two triangles
                    this.addTriangle(x1, y1, z1, x2, y2, z2, x4, y4, z4);
                    this.addTriangle(x1, y1, z1, x4, y4, z4, x3, y3, z3);
                }
            }
        }
    }

}


function radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

