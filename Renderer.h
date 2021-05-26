#pragma once

#include <vulkan/vulkan.h>
#include <vector>
#include <string>
#include <glm/glm.hpp>

struct UniformBufferObject {
    alignas(16) glm::mat4 view;
    alignas(16) glm::mat4 proj;
    alignas(16) glm::vec3 light;
};

class Setup;

class Renderer
{
public:
	VkShaderModule createShaderModule(VkDevice device, const std::vector<char>& code);

	static std::vector<char> readFile(const std::string& filename);
};

