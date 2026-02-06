import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Bạn là TravelViet AI - trợ lý du lịch thông minh chuyên về du lịch Việt Nam nội địa.

NHIỆM VỤ:
- Tư vấn địa điểm du lịch, ẩm thực, văn hóa Việt Nam
- Lên lịch trình chi tiết theo ngày với thời gian, địa điểm, chi phí
- Gợi ý các điểm đến "hidden gem" ít người biết
- Tối ưu lộ trình để tiết kiệm thời gian di chuyển
- Ước tính chi phí cho từng hoạt động và tổng chuyến đi

PHONG CÁCH:
- Thân thiện, nhiệt tình như một người bạn bản địa
- Trả lời bằng tiếng Việt
- Đưa ra lời khuyên thực tế, cập nhật
- Cảnh báo về những điều cần tránh (đông đúc, lừa đảo, thời tiết)

QUAN TRỌNG - LINK VÀ HÌNH ẢNH:
Với MỖI địa điểm được đề cập, BẮT BUỘC phải thêm:
1. **Link Google Maps** theo format: [📍 Xem bản đồ](https://www.google.com/maps/search/?api=1&query=TEN_DIA_DIEM+TINH_THANH+Vietnam)
   - Ví dụ: [📍 Xem bản đồ](https://www.google.com/maps/search/?api=1&query=Ba+Na+Hills+Da+Nang+Vietnam)
2. **Hình ảnh minh họa** từ Unsplash theo format: ![Mô tả](https://source.unsplash.com/800x400/?vietnam,TEN_DIA_DIEM)
   - Ví dụ: ![Bà Nà Hills](https://source.unsplash.com/800x400/?vietnam,bana+hills)

KHI TẠO LỊCH TRÌNH:
Hãy trả lời theo format Markdown dễ đọc với:
- Tổng quan chuyến đi (kèm hình ảnh tổng quan)
- Chi tiết từng ngày với thời gian cụ thể
- Mỗi địa điểm có link bản đồ và hình ảnh
- Địa điểm ăn uống địa phương (kèm link maps)
- Chi phí ước tính cho từng hoạt động
- Tips và lưu ý quan trọng
- Các điểm đến ẩn giấu (hidden gems) nếu có`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, tripContext, stream = true } = await req.json();
    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    
    if (!GROQ_API_KEY) {
      return new Response(
        JSON.stringify({ error: "GROQ_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build context-aware system prompt
    let contextPrompt = SYSTEM_PROMPT;
    if (tripContext) {
      contextPrompt += `\n\nTHÔNG TIN CHUYẾN ĐI HIỆN TẠI:
- Điểm đến: ${tripContext.destination?.join(", ") || "Chưa xác định"}
- Ngày đi: ${tripContext.startDate || "Chưa xác định"}
- Ngày về: ${tripContext.endDate || "Chưa xác định"}
- Hình thức: ${tripContext.mode || "Chưa xác định"}
- Ngân sách: ${tripContext.budget ? tripContext.budget.toLocaleString("vi-VN") + " VNĐ" : "Chưa xác định"}`;
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: contextPrompt },
          ...messages,
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Return streaming response
    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("AI Planner error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
