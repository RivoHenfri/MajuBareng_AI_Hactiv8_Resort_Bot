import type { Language } from './types';

const translations = {
  en: {
    welcome: "🌴 Welcome to the Resort 🌴\nI’m Resort Chat Bot — your resort virtual assistant.\n\nTo begin, please identify yourself.",
    guest_prompt: "Welcome! Please provide your full name and room number to continue.",
    staff_prompt: "Welcome. Please provide your full name and department.",
    language_prompt: "Great. Please select your preferred language for our conversation.",
    guest_welcome: (name: string) => `🌴 Welcome to the Resort 🌴
Hi ${name}, I’m Resort Chat Bot — your resort virtual assistant.
I’m here to make your stay effortless. You can book rooms, reserve spa sessions, plan island experiences, or arrange transport — all in one chat.

Our system is connected directly with our resort team to ensure every request is handled with care and attention.
Whether you’d like to plan your stay or get assistance from our staff, Resort Chat Bot is here to help you every step of the way.

Please select an option from the menu below to get started.

✨ Experience the resort — where genuine hospitality meets intelligent service.`,
    staff_welcome: (name: string) => `Welcome, ${name}. Resort Chat Bot is ready to assist with operational and guest service tasks.

Please select an action below to proceed.`,
    generic_welcome: "How can I assist you today?",
    main_menu_prompt: "Is there anything else I can help you with?",
    parse_guest_error: "I'm sorry, I couldn't quite catch that. Please provide the guest's full name and room number.",
    parse_staff_error: "I'm sorry, I couldn't verify those details. Please provide your full name and department.",
    api_error: "Sorry, I'm having trouble connecting. Please try again later.",
    submenu_error: "Sorry, I couldn't fetch the details for that department.",
    no_submenu_error: (dept: string) => `I couldn't find specific services for ${dept}.`,
    unknown_command: "I'm not sure how to help with that. Please use the menu options to make a request.",
    confirm_ticket_booking_phone: (id: string, phone: string) => `Thank you for your booking! Your request is confirmed under ticket **${id}**. Our staff will contact you shortly at **${phone}**.`,
    confirm_ticket_booking_no_phone: (id:string) => `Thank you for your booking! Your request is confirmed under ticket **${id}**. Our staff will be in touch to confirm the details.`,
    confirm_ticket_generic: (id:string) => `Thank you! Your request has been received and ticket **${id}** has been created. The relevant department will attend to it.`,
    revise_prompt: "Of course. What would you like to change? Please provide the full, corrected details.",
    cancel_prompt: "No problem, the request has been cancelled.",
    department_selected: (dept: string) => `You've selected **${dept}**. What can I help you with?`,
    redirect_wa: (label: string) => `Redirecting you to the ${label} group...`,
    confirm_general_request: (label: string) => `Got it. Just to confirm, you are requesting: **"${label}"**. Is this correct?`,
    confirm_detailed_request: (label: string, details: string) => `Thank you. Just to confirm, your request is:\n**${label}** for **"${details}"**.\n\nIs this correct?`,
    card_confirm_intro: "Thank you. Just to confirm, your request is:",
    card_is_this_correct: "Is this correct?",
    card_service_item: "Service / Item",
    card_description: "Description",
    card_location: "Location",
    card_for_room: "For Room",
    card_priority: "Priority",
    card_airline: "Airline",
    card_flight_number: "Flight Number",
    card_date: "Date",
    card_time: "Time",
    card_guests: "Guests",
    card_contact_number: "Contact Number",
    back_to_main_menu_label: "↩️ Back to Main Menu",
    back_to_main_menu_desc: "Return to department list.",
    start_over_label: "🔄 Start Over",
    start_over_desc: "Return to Guest/Staff selection.",
    confirm_option_label: "✅ Yes, confirm",
    confirm_option_desc: "Proceed with this request.",
    revise_option_label: "✏️ Revise request",
    revise_option_desc: "Change the details.",
    cancel_option_label: "❌ No, cancel",
    cancel_option_desc: "Cancel and return to main menu.",
    staff_action_for_guest_label: "🙋‍♂️ Make Request for Guest",
    staff_action_for_guest_desc: "Book a service or make a request on behalf of a guest.",
    staff_action_operational_label: "🛠️ Report Operational Issue",
    staff_action_operational_desc: "Report a maintenance, supply, or internal department issue.",
    staff_guest_info_prompt: "Understood. Please provide the guest's full name and their room number.",
    guest_placeholder: "e.g., John Doe, Room 101",
    staff_placeholder: "e.g., Jane Smith, Housekeeping",
    staff_guest_placeholder: "e.g., Michael, Villa Bunga",
    menu_selection_placeholder: "Select an option from the menu...",
    conversation_ended_placeholder: "Your conversation has ended.",
    ticket_confirmed_header: "Request Confirmed",
    ticket_id_label: "Please save this ticket number for your reference.",
    copy_id_button: "Copy Ticket ID",
    copied_button: "Copied!",
    start_new_conversation_button: "Start New Conversation",
    ticket_follow_up_message: "Our staff will be in touch with you shortly. Enjoy your stay!",
  },
  id: {
    welcome: "🌴 Selamat Datang di Resort 🌴\nSaya Resort Chat Bot — asisten virtual resort Anda.\n\nUntuk memulai, silakan identifikasi diri Anda.",
    guest_prompt: "Selamat datang! Mohon berikan nama lengkap dan nomor kamar Anda untuk melanjutkan.",
    staff_prompt: "Selamat datang. Mohon berikan nama lengkap dan departemen Anda.",
    language_prompt: "Baik. Silakan pilih bahasa yang Anda inginkan untuk percakapan kita.",
    guest_welcome: (name: string) => `🌴 Selamat Datang di Resort 🌴
Hai ${name}, saya Resort Chat Bot — asisten virtual resort Anda.
Saya di sini untuk membuat pengalaman menginap Anda lebih mudah. Anda dapat memesan kamar, sesi spa, merencanakan pengalaman pulau, atau mengatur transportasi — semua dalam satu obrolan.

Sistem kami terhubung langsung dengan tim resor kami untuk memastikan setiap permintaan ditangani dengan cermat dan penuh perhatian.
Baik Anda ingin merencanakan masa inap atau mendapatkan bantuan dari staf kami, Resort Chat Bot siap membantu Anda di setiap langkah.

Silakan pilih salah satu menu di bawah ini untuk memulai layanan.

✨ Rasakan pengalaman resort — di mana keramahan tulus bertemu dengan layanan cerdas.`,
    staff_welcome: (name: string) => `Selamat datang, ${name}. Resort Chat Bot siap membantu tugas operasional dan layanan tamu.

Silakan pilih tindakan di bawah ini untuk melanjutkan.`,
    generic_welcome: "Ada yang bisa saya bantu hari ini?",
    main_menu_prompt: "Ada lagi yang bisa saya bantu?",
    parse_guest_error: "Maaf, saya kurang mengerti. Mohon berikan nama lengkap tamu dan nomor kamarnya.",
    parse_staff_error: "Maaf, saya tidak dapat memverifikasi detail tersebut. Mohon berikan nama lengkap dan departemen Anda.",
    api_error: "Maaf, saya mengalami masalah koneksi. Silakan coba lagi nanti.",
    submenu_error: "Maaf, saya tidak dapat mengambil detail untuk departemen itu.",
    no_submenu_error: (dept: string) => `Saya tidak dapat menemukan layanan spesifik untuk ${dept}.`,
    unknown_command: "Saya tidak yakin bagaimana cara membantunya. Silakan gunakan opsi menu untuk membuat permintaan.",
    confirm_ticket_booking_phone: (id: string, phone: string) => `Terima kasih atas pemesanan Anda! Permintaan Anda dikonfirmasi dengan tiket **${id}**. Staf kami akan segera menghubungi Anda di **${phone}**.`,
    confirm_ticket_booking_no_phone: (id:string) => `Terima kasih atas pemesanan Anda! Permintaan Anda dikonfirmasi dengan tiket **${id}**. Staf kami akan menghubungi Anda untuk mengonfirmasi detailnya.`,
    confirm_ticket_generic: (id:string) => `Terima kasih! Permintaan Anda telah diterima dan tiket **${id}** telah dibuat. Departemen terkait akan menanganinya.`,
    revise_prompt: "Tentu saja. Apa yang ingin Anda ubah? Mohon berikan detail lengkap yang sudah diperbaiki.",
    cancel_prompt: "Tidak masalah, permintaan telah dibatalkan.",
    department_selected: (dept: string) => `Anda telah memilih **${dept}**. Apa yang bisa saya bantu?`,
    redirect_wa: (label: string) => `Mengarahkan Anda ke grup ${label}...`,
    confirm_general_request: (label: string) => `Baik. Hanya untuk konfirmasi, Anda meminta: **"${label}"**. Apakah ini benar?`,
    confirm_detailed_request: (label: string, details: string) => `Terima kasih. Hanya untuk konfirmasi, permintaan Anda adalah:\n**${label}** untuk **"${details}"**.\n\nApakah ini benar?`,
    card_confirm_intro: "Terima kasih. Hanya untuk konfirmasi, permintaan Anda adalah:",
    card_is_this_correct: "Apakah ini benar?",
    card_service_item: "Layanan / Barang",
    card_description: "Deskripsi",
    card_location: "Lokasi",
    card_for_room: "Untuk Kamar",
    card_priority: "Prioritas",
    card_airline: "Maskapai",
    card_flight_number: "Nomor Penerbangan",
    card_date: "Tanggal",
    card_time: "Waktu",
    card_guests: "Tamu",
    card_contact_number: "Nomor Kontak",
    back_to_main_menu_label: "↩️ Kembali ke Menu Utama",
    back_to_main_menu_desc: "Kembali ke daftar departemen.",
    start_over_label: "🔄 Mulai dari Awal",
    start_over_desc: "Kembali ke pilihan Tamu/Staf.",
    confirm_option_label: "✅ Ya, konfirmasi",
    confirm_option_desc: "Lanjutkan dengan permintaan ini.",
    revise_option_label: "✏️ Ubah permintaan",
    revise_option_desc: "Ubah detailnya.",
    cancel_option_label: "❌ Tidak, batalkan",
    cancel_option_desc: "Batalkan dan kembali ke menu utama.",
    staff_action_for_guest_label: "🙋‍♂️ Buat Permintaan untuk Tamu",
    staff_action_for_guest_desc: "Pesan layanan atau buat permintaan atas nama tamu.",
    staff_action_operational_label: "🛠️ Laporkan Masalah Operasional",
    staff_action_operational_desc: "Laporkan masalah pemeliharaan, persediaan, atau departemen internal.",
    staff_guest_info_prompt: "Dimengerti. Mohon berikan nama lengkap tamu dan nomor kamar mereka.",
    guest_placeholder: "cth., Budi, Kamar 101",
    staff_placeholder: "cth., Siti, Housekeeping",
    staff_guest_placeholder: "cth., Michael, Villa Bunga",
    menu_selection_placeholder: "Pilih opsi dari menu...",
    conversation_ended_placeholder: "Percakapan Anda telah berakhir.",
    ticket_confirmed_header: "Permintaan Dikonfirmasi",
    ticket_id_label: "Harap simpan nomor tiket ini untuk referensi Anda.",
    copy_id_button: "Salin ID Tiket",
    copied_button: "Tersalin!",
    start_new_conversation_button: "Mulai Percakapan Baru",
    ticket_follow_up_message: "Staf kami akan segera menghubungi Anda. Selamat menikmati!",
  },
  ja: {
    welcome: "🌴 リゾートへようこそ 🌴\n私はResort Chat Bot — あなたのリゾートバーチャルアシスタントです。\n\n開始するには、ご自身を特定してください。",
    guest_prompt: "ようこそ！続行するには、氏名と部屋番号を入力してください。",
    staff_prompt: "ようこそ。氏名、部署を入力してください。",
    language_prompt: "承知いたしました。会話に使用する言語を選択してください。",
    guest_welcome: (name: string) => `🌴 リゾートへようこそ 🌴
こんにちは、${name}さん。私はResort Chat Bot — あなたのリゾートバーチャルアシスタントです。
ご滞在が楽になるようお手伝いいたします。お部屋の予約、スパの予約、島での体験プラン、交通手段の手配など、すべてこのチャットで完結します。

当社のシステムはリゾートチームと直接連携しており、すべてのリクエストが丁寧かつ注意深く処理されることを保証します。
ご滞在の計画を立てる場合でも、スタッフのサポートが必要な場合でも、Resort Chat Botがいつでもお手伝いいたします。

開始するには、以下のメニューからオプションを選択してください。

✨ 本物のおもてなしとインテリジェントなサービスが出会うリゾートを体験してください。`,
    staff_welcome: (name: string) => `ようこそ、${name}さん。Resort Chat Botは運営およびゲストサービスのタスクを支援する準備ができています。

続行するには、以下のアクションを選択してください。`,
    generic_welcome: "本日はどのようなご用件でしょうか？",
    main_menu_prompt: "他に何かお手伝いできることはありますか？",
    parse_guest_error: "申し訳ありません、うまく聞き取れませんでした。ゲストの氏名と部屋番号を入力してください。",
    parse_staff_error: "申し訳ありません、詳細を確認できませんでした。氏名、部署を入力してください。",
    api_error: "申し訳ありません、接続に問題が発生しています。後でもう一度お試しください。",
    submenu_error: "申し訳ありません、その部署の詳細を取得できませんでした。",
    no_submenu_error: (dept: string) => `${dept}に関する特定のサービスが見つかりませんでした。`,
    unknown_command: "申し訳ありませんが、そのリクエストには対応できません。メニューオプションを使用してリクエストを行ってください。",
    confirm_ticket_booking_phone: (id: string, phone: string) => `ご予約ありがとうございます！リクエストはチケット**${id}**で確認されました。スタッフが間もなく**${phone}**にご連絡いたします。`,
    confirm_ticket_booking_no_phone: (id:string) => `ご予約ありがとうございます！リクエストはチケット**${id}**で確認されました。詳細確認のため、スタッフがご連絡いたします。`,
    confirm_ticket_generic: (id:string) => `ありがとうございます！リクエストを受け付け、チケット**${id}**が作成されました。担当部署が対応いたします。`,
    revise_prompt: "承知いたしました。何を修正しますか？修正後の詳細をすべて入力してください。",
    cancel_prompt: "問題ありません、リクエストはキャンセルされました。",
    department_selected: (dept: string) => `**${dept}**を選択しました。どのようなご用件でしょうか？`,
    redirect_wa: (label: string) => `${label}グループにリダイレクトしています...`,
    confirm_general_request: (label: string) => `承知いたしました。確認ですが、リクエストは「**${label}**」でよろしいですか？`,
    confirm_detailed_request: (label: string, details: string) => `ありがとうございます。確認ですが、リクエストは以下の通りでよろしいですか？\n**${label}**：**「${details}」**\n\nこれでよろしいですか？`,
    card_confirm_intro: "ありがとうございます。確認ですが、リクエストは以下の通りです：",
    card_is_this_correct: "これでよろしいですか？",
    card_service_item: "サービス/アイテム",
    card_description: "詳細",
    card_location: "場所",
    card_for_room: "部屋番号",
    card_priority: "優先度",
    card_airline: "航空会社",
    card_flight_number: "便名",
    card_date: "日付",
    card_time: "時間",
    card_guests: "人数",
    card_contact_number: "連絡先番号",
    back_to_main_menu_label: "↩️ メインメニューに戻る",
    back_to_main_menu_desc: "部署リストに戻る。",
    start_over_label: "🔄 最初からやり直す",
    start_over_desc: "ゲスト/スタッフの選択に戻る。",
    confirm_option_label: "✅ はい、確認します",
    confirm_option_desc: "このリクエストを続行します。",
    revise_option_label: "✏️ リクエストを修正",
    revise_option_desc: "詳細を変更します。",
    cancel_option_label: "❌ いいえ、キャンセル",
    cancel_option_desc: "キャンセルしてメインメニューに戻ります。",
    staff_action_for_guest_label: "🙋‍♂️ ゲストの代わりにリクエスト",
    staff_action_for_guest_desc: "ゲストの代わりにサービスを予約またはリクエストします。",
    staff_action_operational_label: "🛠️ 運営上の問題を報告",
    staff_action_operational_desc: "メンテナンス、備品、または内部部署の問題を報告します。",
    staff_guest_info_prompt: "承知いたしました。ゲストの氏名と部屋番号を入力してください。",
    guest_placeholder: "例：山田太郎、101号室",
    staff_placeholder: "例：鈴木花子、ハウスキーピング",
    staff_guest_placeholder: "例：マイケル、ブンガ・ヴィラ",
    menu_selection_placeholder: "メニューからオプションを選択...",
    conversation_ended_placeholder: "会話は終了しました。",
    ticket_confirmed_header: "リクエスト確認済み",
    ticket_id_label: "参照用にこのチケット番号を保存してください。",
    copy_id_button: "チケットIDをコピー",
    copied_button: "コピーしました！",
    start_new_conversation_button: "新しい会話を開始",
    ticket_follow_up_message: "スタッフが間もなくご連絡いたします。ご滞在をお楽しみください！",
  },
  zh: {
    welcome: "🌴 欢迎来到度假村 🌴\n我是 Resort Chat Bot — 您的度假村虚拟助手。\n\n请先表明您的身份。",
    guest_prompt: "欢迎！请输入您的全名和房间号以继续。",
    staff_prompt: "欢迎。请输入您的全名和部门。",
    language_prompt: "好的。请选择您希望用于对话的语言。",
    guest_welcome: (name: string) => `🌴 欢迎来到度假村 🌴
您好，${name}，我是 Resort Chat Bot — 您的度假村虚拟助手。
我在这里让您的住宿体验轻松无忧。您可以在一个聊天中预订房间、水疗、规划岛屿体验或安排交通。

我们的系统与度假村团队直接相连，确保每个请求都得到精心处理和关注。
无论您是想规划行程还是需要我们员工的协助，Resort Chat Bot 都会随时为您提供帮助。

请从下面的菜单中选择一个选项开始。

✨ 体验度假村 — 真诚好客与智能服务的完美结合。`,
    staff_welcome: (name: string) => `欢迎，${name}。Resort Chat Bot 已准备好协助处理运营和宾客服务任务。

请选择以下操作以继续。`,
    generic_welcome: "今天有什么可以帮您的？",
    main_menu_prompt: "还有什么可以帮您的吗？",
    parse_guest_error: "抱歉，我没有听清楚。请输入客人的全名和房间号。",
    parse_staff_error: "抱歉，无法验证这些信息。请输入您的全名和部门。",
    api_error: "抱歉，连接时遇到问题。请稍后再试。",
    submenu_error: "抱歉，无法获取该部门的详细信息。",
    no_submenu_error: (dept: string) => `找不到${dept}的具体服务。`,
    unknown_command: "我不确定如何处理该请求。请使用菜单选项提出请求。",
    confirm_ticket_booking_phone: (id: string, phone: string) => `感谢您的预订！您的请求已确认，工单号为**${id}**。我们的工作人员将很快通过**${phone}**与您联系。`,
    confirm_ticket_booking_no_phone: (id:string) => `感谢您的预订！您的请求已确认，工单号为**${id}**。我们的工作人员将与您联系以确认详细信息。`,
    confirm_ticket_generic: (id:string) => `谢谢！您的请求已收到，并已创建工单**${id}**。相关部门将处理您的请求。`,
    revise_prompt: "当然。您想修改什么？请输入完整的、更正后的详细信息。",
    cancel_prompt: "没问题，请求已取消。",
    department_selected: (dept: string) => `您选择了**${dept}**。我能帮您做什么？`,
    redirect_wa: (label: string) => `正在将您重定向到${label}群组...`,
    confirm_general_request: (label: string) => `好的。请确认，您的请求是：“**${label}**”。正确吗？`,
    confirm_detailed_request: (label: string, details: string) => `谢谢。请确认，您的请求是：\n**${label}**，内容为：“**${details}**”。\n\n这正确吗？`,
    card_confirm_intro: "谢谢。请确认，您的请求是：",
    card_is_this_correct: "这正确吗？",
    card_service_item: "服务/项目",
    card_description: "描述",
    card_location: "地点",
    card_for_room: "房间号",
    card_priority: "优先级",
    card_airline: "航空公司",
    card_flight_number: "航班号",
    card_date: "日期",
    card_time: "时间",
    card_guests: "客人数量",
    card_contact_number: "联系电话",
    back_to_main_menu_label: "↩️ 返回主菜单",
    back_to_main_menu_desc: "返回部门列表。",
    start_over_label: "🔄 重新开始",
    start_over_desc: "返回客人/员工选择。",
    confirm_option_label: "✅ 是的，确认",
    confirm_option_desc: "继续此请求。",
    revise_option_label: "✏️ 修改请求",
    revise_option_desc: "更改详细信息。",
    cancel_option_label: "❌ 不，取消",
    cancel_option_desc: "取消并返回主菜单。",
    staff_action_for_guest_label: "🙋‍♂️ 为客人提出请求",
    staff_action_for_guest_desc: "代表客人预订服务或提出请求。",
    staff_action_operational_label: "🛠️ 报告运营问题",
    staff_action_operational_desc: "报告维护、供应或内部部门问题。",
    staff_guest_info_prompt: "明白。请输入客人的全名及其房间号。",
    guest_placeholder: "例如，张三，101房间",
    staff_placeholder: "例如，李四，客房部",
    staff_guest_placeholder: "例如，迈克尔，Bunga别墅",
    menu_selection_placeholder: "从菜单中选择一个选项...",
    conversation_ended_placeholder: "您的对话已结束。",
    ticket_confirmed_header: "请求已确认",
    ticket_id_label: "请保存此工单号以供参考。",
    copy_id_button: "复制工单ID",
    copied_button: "已复制！",
    start_new_conversation_button: "开始新对话",
    ticket_follow_up_message: "我们的工作人员将很快与您联系。祝您住宿愉快！",
  }
};

type TranslationKey = keyof typeof translations.en;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TranslationFunction = (...args: any[]) => string;

export const t = (key: TranslationKey, lang: Language, ...args: unknown[]): string => {
  const translationSet = translations[lang] || translations.en;
  const translationValue = translationSet[key];

  if (typeof translationValue === 'function') {
    return (translationValue as TranslationFunction)(...args);
  }
  
  return translationValue || String(key);
};
