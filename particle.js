class Particle {
    constructor(x, y, z, maxDistance) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.speed = 0.5;
        this.vel = [0, 0, 0]; // only up or down for now
        this.color = [255, 255, 255];

        this.restoration = 0.02;
        this.maxDistance = maxDistance;

        this.initTime = millis();
        this.radius = 20;
    }

    show() {
        push();
        translate(this.x, this.y, this.z);
        colorMode(HSL);
        fill(this.color[0], this.color[1], this.color[2]);
        noStroke();
        sphere(this.radius);
        pop();
    }

    computeFalloff() {
        const distance = Math.sqrt(this.x * this.x + this.z * this.z);
        // console.log(distance, this.maxDistance);
        const r = distance / this.maxDistance;
        // console.log(distance);
        // console.log(r);
        return Math.max(0, (1-r)) * Math.max(0, (1-r));
    }
    update(bassLevel, midLevel, highLevel) {
        this.angle = noise(this.x * 0.0001, this.z * 0.0001, (millis() - this.initTime) * 0.0001) * 360; // degree mode

        this.radius =  bassLevel * 500;
        const hue = highLevel * 360; // Map 0-1 to 0-360 degrees
        const saturation = 80; // Fixed saturation
        const lightness = 50; // Fixed lightness
        this.color = [hue, saturation, lightness];
        this.y = -this.angle * this.computeFalloff() * bassLevel * MAX_DISTANCE / 100;

        this.speed = Math.max(MAX_DISTANCE / 1000, midLevel * MAX_DISTANCE / 20);
        this.vel[0] = this.speed * Math.cos(this.angle);
        this.vel[2] = this.speed * Math.sin(this.angle);

        this.x += this.vel[0];
        this.z += this.vel[2];
    }
}

