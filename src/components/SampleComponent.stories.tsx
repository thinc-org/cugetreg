import SampleComponent from "@/components/SampleComponent";
import { Meta } from '@storybook/react/types-6-0';

export default {
    title: "Component/SampleComponent",
    component: SampleComponent
} as Meta

export const BasicSampleComponent = () => (<SampleComponent/>)