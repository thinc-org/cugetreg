<script lang="ts">
    import { Globe } from "lucide-svelte";
    import GitHubMark from "../lib/components/logo/vendor/GitHubMark.svelte";
    import Facebook from "../lib/components/logo/facebook/facebook.svelte";

    import { QuestionAnswer } from "../lib/components/atoms/faqs";
    import Footer from "../lib/components/organisms/footer/footer.svelte";
    import Navbar from "../lib/components/organisms/navbar/navbar.svelte";
    import Instagram from "../lib/components/logo/instagram/instagram.svelte";
</script>

<Navbar />

<div class="py-12 flex justify-center">
    <div class="w-[80%] min-w-[60vw]">
        <div class="text-3xl font-bold">เกี่ยวกับเรา</div>

        <div class="flex my-5">
            <div class="flex-1 text-lg font-bold">
                <div>ชมรม Thinc.</div>
                <div>จุฬาลงกรณ์มหาวิทยาลัย</div>
            </div>
            <div lang="th" class="flex-1 font-sarabun wrap-break-word">
                ชมรม Thinc. เป็นชมรมที่จัดตั้งและดำเนินการโดยนิสิต
                โดยสังกัดกรรมการนิสิตคณะวิศวกรรมศาสตร์ (กวศ.)
                มีวัตถุประสงค์เพื่อฝึกฝนและฟูมฟักผู้มีความสนใจในการออกแบบและพัฒนาซอฟต์แวร์
                ผ่านการทำโปรเจคพัฒนาซอฟต์แวร์เพื่อสังคมจุฬาฯ
                ผลงานที่ผ่านมาของชมรม Thinc. เช่น
                <ul class="list-disc pl-5">
                    <li>
                        ระบบจองสนามกีฬา CU Sports Center แอปพลิเคชัน CU Pop Bus
                    </li>
                    <li>ระบบลงทะเบียนขึ้นสแตนด์แปรอักษรฝั่งจุฬาฯ</li>
                    <li>
                        งานฟุตบอลประเพณีจุฬาฯ-ธรรมศาสตร์ ครั้งที่ 74 Companion
                        App ในงาน
                    </li>
                    <li>JavaScript Bangkok 1.0.0</li>
                </ul>
            </div>
        </div>

        <div class="text-2xl font-bold">เกี่ยวกับ CU Get Reg</div>

        <QuestionAnswer question="ที่มาของโปรเจค">
            CU Get Reg เกิดมาจาก Pain Point ในการลงทะเบียนเรียนของนิสิตจุฬาฯ
            ที่มักจะต้องลงทะเบียนทั้งวิชาบังคับ วิชาเลือก และวิชาศึกษาทั่วไป
            (GenEd) ในแต่ละเทอม แต่จำเป็นต้องหาข้อมูลจากหลาย ๆ
            แหล่งที่แตกต่างกัน
            ทั้งยังไม่มีแหล่งใดที่นำเสนอตารางเรียนออกมาเป็นภาพให้เข้าใจง่ายตั้งแต่ก่อนลงทะเบียน
            ด้วยเหตุนี้ ทางทีมงานจึงได้พัฒนา CU Get Reg ขึ้น
            เพื่อให้สามารถค้นหาและเลือกรายวิชาได้อย่างสะดวก
            และจัดตารางเรียนตามข้อจำกัดของหลักสูตรของแต่ละคนได้ง่ายขึ้น
            ทางทีมงานมีความมุ่งมั่นที่จะทำให้ CU Get Reg
            เป็นเว็บไซต์ศูนย์กลางที่รวบรวมข้อมูลรายวิชาไว้ได้อย่างครบถ้วน
            และมุ่งที่จะสร้างเว็บไวต์นี้ให้เป็นพื้นที่สำหรับการแบ่งปันข้อมูลรายวิชาระหว่างนิสิตในอนาคต
        </QuestionAnswer>
        <QuestionAnswer question="CU Get Reg นำข้อมูลมาจากไหน?">
            <ul class="list-disc">
                <li>
                    ข้อมูลรายวิชาและข้อมูลตอนเรียน: นำมาจากหน้า 
                    <a
                        href="https://cas.reg.chula.ac.th/cu/cs/QueryCourseScheduleNew/index.html"
                        class="link"
                    >
                        สอบถามตารางสอนตารางสอบ
                    </a>
                    ของสำนักงานการทะเบียน
                </li>
                <li>
                    ในปัจจุบัน ข้อมูลจากหน้านี้อาจล่าช้าจากข้อมูลภายในระบบ Reg
                    Chula ไป 1 วัน ทั้งนี้
                    ทีมงานกำลังประสานงานกับสำนักงานการทะเบียนเพื่อเข้าถึงข้อมูลรายวิชาโดยตรง
                    เพื่อให้ไม่พบปัญหาดังกล่าว
                </li>
                <li>
                    ข้อมูลตอนเรียนรายวิชา GenEd: ได้รับข้อมูลจาก Gen อย่าได้ Ed
                    และศูนย์การศึกษาทั่วไป
                </li>
                <li>
                    คำอธิบายรายวิชา: นำมาจาก ระบบค้นหาคำอธิบายรายวิชา ของสำนักบริหารวิชาการ
                    จุฬาฯ
                </li>
            </ul>
        </QuestionAnswer>

        <QuestionAnswer question="การเข้าสู่ระบบ มีประโยชน์อย่างไรบ้าง?">
            เมื่อคุณเข้าสู่ระบบ ระบบจะบันทึกข้อมูลตารางเรียนไว้ในบัญชี Google
            ของคุณ
            ทำให้สามารถเข้าสู่ระบบเพื่อดูข้อมูลตารางเรียนที่เลือกไว้ข้ามอุปกรณ์ได้
            รวมถึงเป็นการยืนยันตัวตนเพื่อเขียนรีวิวรายวิชาที่คุณเรียนมา
            ในการเข้าสู่ระบบ สามารถใช้บัญชีอีเมลนิสิต
            (รหัสนิสิต@student.chula.ac.th) เท่านั้น
            เพื่อให้สามารถยืนยันตัวตนได้ว่าเป็นนิสิตจุฬาฯ
            หากต้องการทราบว่าเราเก็บข้อมูลใดและนำไปใช้อย่างไรบ้าง
            สามารถอ่านเพิ่มเติมได้ที่ <a
                href="cugetreg.com/privacy"
                class="link">Privacy Policy</a
            > ของเรา
        </QuestionAnswer>

        <QuestionAnswer question="ความร่วมมือกับหน่วยงานอื่น ๆ">
            CU Get Reg มีความร่วมมือกับหน่วยงานอื่นภายในจุฬาฯ ได้แก่
            <ul class="list-disc">
                <li>
                    สำนักงานการทะเบียน (Reg Chula): CU Get Reg
                    ได้รับการสนับสนุนเซิร์ฟเวอร์จากสำนักงานการทะเบียน นอกจากนี้
                    ทางสำนักงานการทะเบียนยังพร้อมให้ความสนับสนุนในด้านข้อมูลรายวิชา
                    ซึ่งกำลังอยู่ในระหว่างดำเนินการ  
                    <br />
                    <a href="reg.chula.ac.th" class="link"
                        >(เว็บไซต์ สำนักงานการทะเบียน)</a
                    >
                </li>
                <li>
                    Gen อย่าได้ Ed: ปัจจุบันร่วมมือกับ CU Get Reg
                    ในการประชาสัมพันธ์เว็บไซต์ให้กับนิสิตจุฬาฯ 
                    <br />
                    <a href="https://www.facebook.com/genedahs" class="link"
                        >(Facebook Page: Gen อย่าได้ Ed)</a
                    >
                </li>
                <li>
                    ศูนย์การศึกษาทั่วไป (GenEd Chula): CU Get Reg
                    ได้รับการสนับสนุนจากศูนย์การศึกษาทั่วไปในด้านข้อมูลรายวิชาศึกษาทั่วไป
                    (GenEd) 
                    <br />
                    <a href="https://www.gened.chula.ac.th" class="link"
                        >(เว็บไซต์ ศูนย์การศึกษาทั่วไป)</a
                    >
                </li>
            </ul>
        </QuestionAnswer>

        <QuestionAnswer question="ติดต่อทีมงาน">
            สามารถแจ้งปัญหาขัดข้องเกี่ยวกับการใช้งานเว็บไซต์ ข้อมูลที่ไม่ถูกต้อง
            หรือข้อเสนอแนะต่าง ๆ ได้ทาง <a class="link">ฟอร์มแจ้งปัญหา</a>
            ที่มุมบนขวาของหน้าเว็บ หากต้องการติดต่อสอบถามเกี่ยวกับเว็บไซต์ CU Get
            Reg หรือติดต่อชมรม Thinc. สามารถสอบถามทาง 
            <a href="https://www.facebook.com/ThailandIncubator" class="link"
                >Facebook Page: Thinc.</a
            >
            ได้โดยตรง

            <ul class="list-normal mt-2 space-y-3 fill-blue-700">
                <li class="flex items-center">
                    <Globe class="w-[2em] h-[2em] m-2 stroke-blue-700" />
                    <a class="link" href="thinc.in.th">https://thinc.in.th</a>
                </li>
                <li class="flex items-center">
                    <Facebook class="w-[2em] h-[2em] m-2" />
                    <a
                        class="link"
                        href="https://www.facebook.com/ThailandIncubator"
                        >Facebook: Thinc.</a
                    >
                </li>
                <li class="flex items-center">
                    <GitHubMark class="w-[2em] h-[2em] m-2" />
                    <a class="link" href="https://github.com/thinc-org"
                        >GitHub: Thinc.</a
                    >
                </li>
                <li class="flex items-center">
                    <Instagram class="w-[2em] h-[2em] m-2" />
                    <a class="link" href="https://www.instagram.com/thinc.in.th/"
                        >Instagram: Thinc.</a
                    >
                </li>
            </ul>
        </QuestionAnswer>
    </div>
</div>

<Footer />

<style>
    @reference "../app.css";

    .link {
        @apply text-blue-700 underline;
    }
</style>
