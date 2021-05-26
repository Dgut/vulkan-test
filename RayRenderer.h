#pragma once
#include "Renderer.h"

class RayRenderer : public Renderer
{
    VkPipelineLayout pipelineLayout;
    VkPipeline graphicsPipeline;

    VkDescriptorSetLayout descriptorSetLayout;
    std::vector<VkDescriptorSet> descriptorSets;
public:
    void init(Setup& setup)
    {
        createDescriptorSetLayout(setup);
        createDescriptorSets(setup);
        createGraphicsPipeline(setup);
    }

    void createGraphicsPipeline(Setup& setup);

    void createDescriptorSetLayout(Setup& setup);

    void createDescriptorSets(Setup& setup);

    void cleanup(VkDevice device);

    void draw(Setup& setup, VkCommandBuffer commandBuffer, uint32_t currentImage);
};

extern RayRenderer rayRenderer;
