#version 450
#extension GL_ARB_separate_shader_objects : enable

layout(binding = 0) uniform UniformBufferObject {
    mat4 view;
    mat4 proj;
    vec3 light;
} ubo;

struct Vertex
{   
    vec3 pos;
    vec3 normal;
    vec3 color;
};

layout(std430, binding = 1) buffer Vertices {
    Vertex vertices[];
};

layout(binding = 2) buffer Indices {
    uint indices[];
};

layout(location = 0) in vec3 fragRayPos;
layout(location = 1) in vec3 fragRayDir;
layout(location = 2) in vec3 fragSphereCenter;
layout(location = 3) in vec3 fragPlaneCenter;
layout(location = 4) in vec3 fragPlaneNormal;
layout(location = 5) in vec3 fragLight;

layout(location = 0) out vec4 outColor;

/*float sphere(vec3 r0, vec3 rd, vec3 s0, float sr) {
    float a = dot(rd, rd);
    vec3 s0_r0 = r0 - s0;
    float b = 2.0 * dot(rd, s0_r0);
    float c = dot(s0_r0, s0_r0) - (sr * sr);
    if (b*b - 4.0*a*c < 0.0)
        return -1.0;
    return (-b - sqrt((b*b) - 4.0*a*c))/(2.0*a);
}

float plane(vec3 r0, vec3 rd, vec3 p0, vec3 pn) {
    float rn = dot(rd, pn);
    if(rn > -0.0000001)
        return -1.0;
    return dot(pn, (p0 - r0)) / rn;
}

float intersect(vec3 r0, vec3 rd, out vec3 p, out vec3 n, out vec3 c)
{
    float d = sphere(r0, rd, fragSphereCenter, 0.99);
    if(d < 0.0)
    {
        d = plane(r0, rd, fragPlaneCenter, fragPlaneNormal);
        if(d > 0.0)
        {
            p = r0 + rd * d;
            n = fragPlaneNormal;
            c = vec3(0.5, 1., 0.75);
        }
    }
    else
    {
        p = r0 + rd * d;
        n = normalize(p - fragSphereCenter);
        c = vec3(0.95, 0.45, 0.4);
    }
    return d;
}

float intersect(vec3 r0, vec3 rd)
{
    vec3 p, n, c;
    return intersect(r0, rd, p, n, c);
}*/

bool triangle(vec3 r0, vec3 rd, uint i0, uint i1, uint i2,
                        out float hit, out vec3 c)
{
    const vec3 p0 = vertices[i0].pos;
    const vec3 p1 = vertices[i1].pos;
    const vec3 p2 = vertices[i2].pos;

    const vec3 e0 = p1 - p0;
    const vec3 e1 = p0 - p2;
    const vec3 n = cross( e1, e0 );

    const vec3 e2 = ( 1.0 / dot( n, rd ) ) * ( p0 - r0 );
    const vec3 i  = cross( rd, e2 );

    c.y = dot( i, e1 );
    c.z = dot( i, e0 );
    c.x = 1.0 - (c.z + c.y);
    hit = dot( n, e2 );

    return (hit > 0.0000001) && all(greaterThanEqual(c, vec3(0.0)));
}

bool nearest(vec3 r0, vec3 rd, out float hit, out vec3 n, out vec3 c)
{
    float best = 1.0 / 0.0;

    vec3 bc;

    for(int i = 0; i < indices.length(); i += 3)
    {
        const uint i0 = indices[i + 0];
        const uint i1 = indices[i + 1];
        const uint i2 = indices[i + 2];

        if(triangle(r0, rd, i0, i1, i2, hit, bc))
            if(best > hit)
            {
                best = hit;
                n = vertices[i0].normal * bc.x +
                    vertices[i1].normal * bc.y +
                    vertices[i2].normal * bc.z;
                c = vertices[i0].color;
            }
    }

    hit = best;

    return !isinf(best);
}

float intersect(vec3 r0, vec3 rd)
{
    float hit;
    vec3 c;

    for(int i = 0; i < indices.length(); i += 3)
    {
        const uint i0 = indices[i + 0];
        const uint i1 = indices[i + 1];
        const uint i2 = indices[i + 2];

        if(triangle(r0, rd, i0, i1, i2, hit, c))
            return 0.0;
    }

    return 1.0;
}

void main() {
    vec3 ray = normalize(fragRayDir);

    float hit;
    vec3 n;
    vec3 c;

    if(!nearest(fragRayPos, ray, hit, n, c))
    {
        outColor = vec4(0.0);
        return;
    }

    vec3 p = fragRayPos + ray * hit;

    vec3 lightDir = normalize(fragLight - p);

    float diff = max(dot(n, lightDir), 0.0) * intersect(p + n * 0.01, lightDir);
    vec3 color = c * (diff + 0.1);
    outColor = vec4(color, 1.0);

    /*vec3 p;
    vec3 n;
    vec3 c;

    float d = intersect(fragRayPos, ray, p, n, c);
    if(d < 0.0)
    {
        outColor = vec4(0.0);
        return;
    }

    vec3 lightDir = normalize(fragLight - p);

    float diff = max(dot(n, lightDir), 0.0) * step( 0.0, -intersect( p, lightDir ) );
    vec3 color = c * (diff + 0.1);
    outColor = vec4(color, 1.0);*/
}