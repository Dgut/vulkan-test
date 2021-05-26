#pragma once

#include "Renderer.h"

class RasterRenderer : public Renderer
{    
    VkPipelineLayout pipelineLayout;
    VkPipeline graphicsPipeline;

    VkDescriptorSetLayout descriptorSetLayout;
    std::vector<VkDescriptorSet> descriptorSets;
public:
    void init(Setup& setup)
    {
        createDescriptorSetLayout(setup);
        createGraphicsPipeline(setup);
        createDescriptorSets(setup);
    }

    void createGraphicsPipeline(Setup& setup);

    void createDescriptorSetLayout(Setup& setup);

    void createDescriptorSets(Setup& setup);

    void cleanup(VkDevice device);

    void draw(Setup& setup, VkCommandBuffer commandBuffer, uint32_t currentImage);

    //void updateUniformBuffer(Setup& setup, uint32_t currentImage, const UniformBufferObject& ubo);
};

extern RasterRenderer rasterRenderer;
