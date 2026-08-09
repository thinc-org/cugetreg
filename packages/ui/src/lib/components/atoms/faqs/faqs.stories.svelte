<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import { QuestionAnswer } from './index.ts';

	const { Story } = defineMeta({
		title: 'Atom/FAQS Questions-Answer',
		component: QuestionAnswer,
		tags: ['autodocs'],
		argTypes: {
			question: {
				control: 'text',
				defaultValue: 'ที่มาของโปรเจค'
			},
			children: {
				control: false
			},
			class: {
				control: false,
				defaultValue: ''
			}
		}
	});
</script>

<Story name="Default" args={{ question: 'ที่มาของโปรเจค' }}>
	CU Get Reg เกิดมาจาก Pain Point ในการลงทะเบียนเรียนของนิสิตจุฬาฯ
	ที่มักจะต้องลงทะเบียนทั้งวิชาบังคับ วิชาเลือก และวิชาศึกษาทั่วไป (GenEd) ในแต่ละเทอม
	แต่จำเป็นต้องหาข้อมูลจากหลาย ๆ แหล่งที่แตกต่างกัน
	ทั้งยังไม่มีแหล่งใดที่นำเสนอตารางเรียนออกมาเป็นภาพให้เข้าใจง่ายตั้งแต่ก่อนลงทะเบียนด้วยเหตุนี้
	ทางทีมงานจึงได้พัฒนา CU Get Reg ขึ้น เพื่อให้สามารถค้นหาและเลือกรายวิชาได้อย่างสะดวก
	และจัดตารางเรียนตามข้อจำกัดของหลักสูตรของแต่ละคนได้ง่ายขึ้นทางทีมงานมีความมุ่งมั่นที่จะทำให้ CU
	Get Reg เป็นเว็บไซต์ศูนย์กลางที่รวบรวมข้อมูลรายวิชาไว้ได้อย่างครบถ้วน
	และมุ่งที่จะสร้างเว็บไวต์นี้ให้เป็นพื้นที่สำหรับการแบ่งปันข้อมูลรายวิชาระหว่างนิสิตในอนาคต
</Story>

<Story name="With HTML Element" args={{ question: 'ชมรม Thinc. จุฬาลงกรณ์มหาวิทยาลัย' }}>
	ชมรม Thinc. เป็นชมรมที่จัดตั้งและดำเนินการโดยนิสิต โดยสังกัดกรรมการนิสิตคณะวิศวกรรมศาสตร์ (กวศ.)
	มีวัตถุประสงค์เพื่อฝึกฝนและฟูมฟักผู้มีความสนใจในการออกแบบและพัฒนาซอฟต์แวร์
	ผ่านการทำโปรเจคพัฒนาซอฟต์แวร์เพื่อสังคมจุฬาฯ ผลงานที่ผ่านมาของชมรม Thinc. เช่น
	<ul class="list-disc pl-5">
		<li>ระบบจองสนามกีฬา CU Sports Center แอปพลิเคชัน CU Pop Bus</li>
		<li>ระบบลงทะเบียนขึ้นสแตนด์แปรอักษรฝั่งจุฬาฯ</li>
		<li>งานฟุตบอลประเพณีจุฬาฯ-ธรรมศาสตร์ ครั้งที่ 74 Companion App ในงาน</li>
		<li>JavaScript Bangkok 1.0.0</li>
	</ul>
</Story>
