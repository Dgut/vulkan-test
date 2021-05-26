#version 450
#extension GL_ARB_separate_shader_objects : enable

layout(binding = 0) uniform UniformBufferObject {
    mat4 view;
    mat4 proj;
    vec3 light;
} ubo;

layout(location = 0) out vec3 fragRayPos;
layout(location = 1) out vec3 fragRayDir;
layout(location = 2) out vec3 fragSphereCenter;
layout(location = 3) out vec3 fragPlaneCenter;
layout(location = 4) out vec3 fragPlaneNormal;
layout(location = 5) out vec3 fragLight;

vec2 positions[4] = vec2[](
    vec2(-1.0, -1.0),
    vec2(1.0, -1.0),
    vec2(1.0, 1.0),
    vec2(-1.0, 1.0)
);

void main() {
    gl_Position = vec4(positions[gl_VertexIndex], 0.0, 1.0);

    /*fragRayPos = vec3(0.0);
    fragRayDir = vec3(inverse(ubo.proj) * vec4(positions[gl_VertexIndex], 0.0, 1.0));
    fragSphereCenter = vec3(ubo.view * vec4(0.0, 0.0, 0.0, 1.0));
    fragPlaneCenter = vec3(ubo.view * vec4(0.0, 0.0, -1.0, 1.0));

    mat3 normalMatrix = mat3(ubo.view);
    normalMatrix = inverse(normalMatrix);
    normalMatrix = transpose(normalMatrix);

    fragPlaneNormal = vec3(normalMatrix*vec3(0.0, 0.0, 1.0));*/

    fragRayPos = vec3(inverse(ubo.view) * vec4(0.0, 0.0, 0.0, 1.0));
    fragRayDir = vec3(inverse(ubo.view) * vec4( vec3(inverse(ubo.proj) * vec4(positions[gl_VertexIndex], 0.0, 1.0)), 0.0) );
    fragSphereCenter = vec3(0.0, 0.0, 0.0);
    fragPlaneCenter = vec3(0.0, 0.0, -1.0);
    fragPlaneNormal = vec3(0.0, 0.0, 1.0);
    fragLight = vec3(inverse(ubo.view)*vec4(ubo.light, 1.0));
}