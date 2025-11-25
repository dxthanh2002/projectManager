<script setup lang="ts">
</script>
<template>
        <section id="story">
      <!-- lớp chứa hình nền -->
      <div
        class="flex justify-end h-screen max-h-[1100px] p-0 w-full max-w-none bg-[url(/assets/aboutUsImg.jpg)] bg-no-repeat bg-center bg-cover"
      >
        <!-- lớp overlay chiếm 2/3 màn hình -->
        <div class="w-full h-full lg:w-2/3 bg-p-950/60 p-9">
          <div
            class="container relative flex items-center justify-center h-full md:justify-end 2xl:justify-center"
          >
            <!-- watermark -->
            <div
              data-aos="fade-right"
              class="absolute hidden -translate-y-1/2 translate-x-36 top-1/2 right-1/2 md:block 2xl:translate-x-0"
            >
              <h1
                class="uppercase -rotate-90 text-[168px] text-center leading-[148px] font-bold text-p-50 opacity-20"
              >
                TEA <br />
                STATION
              </h1>
            </div>

            <!-- nội dung chính -->
            <div
              class="relative"
              data-aos="fade-left"
            >
              <div class="mb-9">
                <h2 class="!text-p-200 sub_heading">Khám phá</h2>
                <h1 class="text-white main_heading">Câu chuyện & sứ mệnh</h1>
              </div>

              <p class="text-n-200 max-w-80">
                Tại Tea Station, chúng tôi tận tâm tạo ra những loại trà đặc biệt tôn
                vinh hương vị và sức khỏe. Có nguồn gốc từ những thành phần tốt nhất,
                các hỗn hợp của chúng tôi được chế tác bằng sự chăm chút và đam mê,
                đảm bảo mỗi tách trà đều mang đến trải nghiệm thú vị. <br />
                Cam kết về tính bền vững và hỗ trợ cộng đồng địa phương, chúng tôi
                mong muốn mang đến cho bạn không chỉ là trà, mà còn là sự kết nối với
                thiên nhiên và truyền thống trong từng ngụm trà. Hãy cùng chúng tôi
                thưởng thức hành trình của trà.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
</template>