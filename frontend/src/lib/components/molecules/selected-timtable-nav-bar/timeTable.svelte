<div class = "container">
    <select class="select">
        <option value = ''>เลือกตารางเรียน</option>
        <option value = 'Y2S1'>ปี 2 เทอม 1</option>
        <option value = 'Y2S2'>ปี 2 เทอม 2</option>
        <option value = 'Y2Summer'>ปี 2 ฤดูร้อน</option>
    </select>


    <div class="right">{"    ทวิภาค\n2566/ภาคต้น    "}</div>
</div>

<style>
    .container{
        display: flex;
        gap :10px

    }
    .select{
        border: 1px solid hsl(222 52% 53%);
        border-radius: 8px;
        color: hsl(222 52% 53%);
        padding: 5px;

    }
    .select:focus {
        /* This removes the black outline */
        outline: none; 
    }
    .right{
        border: 1px solid black;
        border-radius: 8px;
        padding: 5px;

    }
</style>