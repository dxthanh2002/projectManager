<template>
    <section
      id="hero"
      class="h-screen max-h-[1100px] bg-gradient-to-t from-p-100 to-white overflow-y-clip"
    >
      <div
        class="container relative flex items-center justify-center w-full h-full xl:justify-start"
      >
        <!-- hình -->
        <div
          data-aos="fade-left"
          class="absolute bottom-0 right-0 z-0 overflow-hidden md:-bottom-40 xl:top-1/2 xl:-translate-y-1/2"
        >
          <img
            src="../assets/hero_img.png"
            alt="hero-img"
            class="h-full 2xl:[mask-image:linear-gradient(to_left,transparent,black_10%)]"
          />
        </div>

        <!-- nội dung chính -->

        <div
          class="z-10 flex flex-col items-center justify-center gap-4 md:gap-9 xl:items-start"
        >
          <div>
            <h2
              data-aos="zoom-in"
              class="mb-2 text-xs font-semibold leading-none tracking-wider text-center uppercase font-inter md:text-sm xl:text-start"
            >
              hơn
              <span class="text-xs text-gradient md:text-sm">một trăm</span> hương vị
              trà
            </h2>
            <h1
              data-aos="zoom-in"
              data-aos-delay="100"
              class="text-5xl leading-none tracking-wide text-center capitalize font-lobster text-p-950 md:text-6xl lg:text-7xl"
            >
              Trà Đặc Biệt Chế Tác
            </h1>
          </div>

          <p
            data-aos="zoom-in"
            data-aos-delay="200"
            class="max-w-xl px-4 text-center text-n-700 md:px-0 xl:text-start"
          >
            Sứ mệnh của chúng tôi là mang đến cho bạn sự yên bình và kết nối thông
            qua các hương vị trà được chọn lọc cẩn thận và được tạo ra để nâng cao
            trải nghiệm hàng ngày và sức khoẻ toàn diện cho bạn.
          </p>

          <button
            data-aos="zoom-in"
            data-aos-delay="300"
          >
            <a
              class="btn"
              href="#products"
              >Tìm Hiểu Sản Phẩm
              <img
                src="../assets/right-arrow.svg"
                alt="right arrow"
            /></a>
          </button>
        </div>
      </div>
    </section>
</template>