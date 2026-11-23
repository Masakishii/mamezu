/**
 * 現場システム 3アプリ共通マスター ＆ 共通描画エンジン（GenbaMamezuShared）
 * 対象アプリ:
 *   1. 豆図スタジオ Pro (mamezu_app.html)
 *   2. 工事写真台帳システム (construction_ledger_app.html)
 *   3. 現場測量・記録野帳アプリ (fieldnote_app.html)
 *
 * 使い方: 各HTMLの <head> で <script src="mamezu_presets.js"></script> を読み込むだけで
 * window.GenbaMamezuShared を通じて同じ線種18種・破線20種・ハッチ12種・雛形120種・描画関数を共通利用できます。
 */

(function(global) {
  'use strict';

  // ==================== 1. 共通スタイル定義（線種18種・破線20種・矢印12種・寸法補助線10種・文字枠10種・ハッチ12種） ====================
  const STYLE_DEFS = {
    // 1. 寸法線の補助線スタイル 10種類
    dimExtStyles: [
      { id: 'tick_short',  label: '① 建築斜線＋短補助線' },
      { id: 'tick_long',   label: '② 建築斜線＋長補助線' },
      { id: 'arrow_out',   label: '③ 外向き黒矢印＋補助線' },
      { id: 'arrow_in',    label: '④ 内向き黒矢印＋補助線' },
      { id: 'open_arrow',  label: '⑤ 白抜き矢印＋補助線' },
      { id: 'dot_ext',     label: '⑥ 黒丸点＋補助線' },
      { id: 'circle_open', label: '⑦ 白丸＋補助線' },
      { id: 'bar_ext',     label: '⑧ 垂直止線＋延長補助線' },
      { id: 'center_ext',  label: '⑨ 一点鎖線基準補助線' },
      { id: 'none_ext',    label: '⑩ 補助線なし（線のみ）' }
    ],

    // 2. 文字枠線の種類（枠線無し ＋ もこもこ・ギザギザ含む10種類）
    textBoxStyles: [
      { id: 'none',    label: '枠線なし（白フチ文字）' },
      { id: 'solid',   label: '① 実線枠（白背景）' },
      { id: 'double',  label: '② 二重線枠' },
      { id: 'dashed',  label: '③ 破線枠' },
      { id: 'dotted',  label: '④ 点線枠' },
      { id: 'pill',    label: '⑤ 角丸カプセル枠' },
      { id: 'cloud',   label: '⑥ もこもこ雲枠' },
      { id: 'zigzag',  label: '⑦ ギザギザ集中線枠' },
      { id: 'callout', label: '⑧ 吹き出し枠' },
      { id: 'bracket', label: '⑨ 四隅カギ括弧枠' },
      { id: 'badge',   label: '⑩ ベタ塗り反転ラベル' }
    ],

    // 3. ハッチング 12種類
    hatchPatterns: [
      { id: 'diag45',     label: '① 45°右上がり斜線' },
      { id: 'diag135',    label: '② 135°左上がり斜線' },
      { id: 'cross',      label: '③ クロス網目 (45×135)' },
      { id: 'grid',       label: '④ 正方格子メッシュ' },
      { id: 'horiz',      label: '⑤ 水平平行線（水面/盛土）' },
      { id: 'vert',       label: '⑥ 垂直平行線（壁/柱）' },
      { id: 'dots',       label: '⑦ ドット点描（砂/モルタル）' },
      { id: 'concrete',   label: '⑧ コンクリート（砕石＋点）' },
      { id: 'brick',      label: '⑨ レンガ・ブロック積み' },
      { id: 'insulation', label: '⑩ 断熱材（連続波ジグザグ）' },
      { id: 'gravel',     label: '⑪ 砕石・割栗石（三角礫）' },
      { id: 'wood',       label: '⑫ 木材・合板（木目年輪）' }
    ],

    // 4. 各種線種 18種類（建築・土木・設備・電気実務記号線を含む）
    lineStyles: [
      { id: 'solid',        label: '① 実線 ━━' },
      { id: 'double',       label: '② 二重線 ══（壁・管路）' },
      { id: 'triple',       label: '③ 三重線 ☰（複合壁）' },
      { id: 'wavy',         label: '④ 波線 〰️（省略・水面）' },
      { id: 'zigzag',       label: '⑤ ギザギザ線 ⚡（破断）' },
      { id: 'scallop',      label: '⑥ もこもこ雲線 ☁️' },
      { id: 'thick_thin',   label: '⑦ 太細複合線 ▬─' },
      { id: 'rail',         label: '⑧ 線路・目盛り線 ╪╪' },
      { id: 'dashed',       label: '⑨ 破線 ╌╌（隠れ線）' },
      { id: 'dashdot',      label: '⑩ 一点鎖線 ╍╍（通り芯）' },
      { id: 'dashdot2',     label: '⑪ 二点鎖線 ╍··╍（敷地境界）' },
      { id: 'pipe_water',   label: '⑫ 給水管線 ━W━' },
      { id: 'pipe_drain',   label: '⑬ 排水管線 ╌D╌' },
      { id: 'elec_wire',    label: '⑭ 電気配線・雷線 ━⚡━' },
      { id: 'weld_fillet',  label: '⑮ 隅肉溶接連続線 ▲▲▲' },
      { id: 'earth_ground', label: '⑯ 地盤・GL線 〒〒〒' },
      { id: 'fence_x',      label: '⑰ 仮囲い・柵線 ×━×' },
      { id: 'arrow_flow',   label: '⑱ 方向矢印連続線 ➤━➤' }
    ],

    // 5. 破線・点線の種類 20種類（配列は線幅 sw の倍率）
    dashPatterns: [
      { id: 'none',           label: '破線指定: 線種に従う',       mult: null },
      { id: 'dash_s',         label: '01. 細かめ破線',            mult: [1.6, 1.2] },
      { id: 'dash_m',         label: '02. 標準破線',              mult: [3.5, 2.2] },
      { id: 'dash_l',         label: '03. 長め破線',              mult: [6.5, 3.0] },
      { id: 'dash_xl',        label: '04. 超長破線',              mult: [10.5, 4.0] },
      { id: 'dot_s',          label: '05. 細密点線',              mult: [0.6, 1.4] },
      { id: 'dot_m',          label: '06. 標準点線',              mult: [0.9, 2.5] },
      { id: 'dot_l',          label: '07. 間隔広め点線',          mult: [1.0, 4.5] },
      { id: 'dashdot1',       label: '08. 一点鎖線（標準）',      mult: [5.5, 1.6, 0.8, 1.6] },
      { id: 'dashdot1_l',     label: '09. 一点鎖線（通り芯）',    mult: [9.0, 2.0, 1.0, 2.0] },
      { id: 'dashdot2',       label: '10. 二点鎖線（標準）',      mult: [5.5, 1.4, 0.8, 1.4, 0.8, 1.4] },
      { id: 'dashdot2_l',     label: '11. 二点鎖線（敷地境界）',  mult: [9.0, 1.8, 1.0, 1.8, 1.0, 1.8] },
      { id: 'dashdot3',       label: '12. 三点鎖線',              mult: [5.5, 1.3, 0.7, 1.3, 0.7, 1.3, 0.7, 1.3] },
      { id: 'long_short',     label: '13. 長短交互破線',          mult: [6.5, 1.8, 2.5, 1.8] },
      { id: 'double_dash',    label: '14. 二連破線',              mult: [3.0, 1.2, 3.0, 3.8] },
      { id: 'sparse_dash',    label: '15. まばら破線',            mult: [2.5, 5.5] },
      { id: 'axis_xl',        label: '16. 通り芯専用（極長一点）', mult: [13.0, 2.2, 1.0, 2.2] },
      { id: 'boundary_xl',    label: '17. 境界専用（極長二点）',   mult: [13.0, 2.0, 1.0, 2.0, 1.0, 2.0] },
      { id: 'demolish_eq',    label: '18. 既存撤去線（均等破線）', mult: [4.5, 4.5] },
      { id: 'hidden_dense',   label: '19. 隠れ線・埋設（密破線）', mult: [2.2, 1.8] },
      { id: 'plan_long',      label: '20. 仮設・計画線（長破線）', mult: [8.0, 1.5] }
    ],

    // 6. 矢印・端点マーカー 12種類（none + 12種）
    arrowTypes: [
      { id: 'none',         label: 'なし' },
      { id: 'filled',       label: '① ▶ 黒三角矢印' },
      { id: 'open',         label: '② ▷ 白三角矢印' },
      { id: 'sharp',        label: '③ ＞ 鋭角矢印' },
      { id: 'stealth',      label: '④ ➤ ステルス矢印' },
      { id: 'harpoon',      label: '⑤ ⇀ 片羽根矢印' },
      { id: 'double_arrow', label: '⑥ ⏩ 二重矢印' },
      { id: 'circle',       label: '⑦ ● 黒丸' },
      { id: 'open_circle',  label: '⑧ ○ 白丸' },
      { id: 'square',       label: '⑨ ■ 黒四角' },
      { id: 'diamond',      label: '⑩ ◆ ひし形' },
      { id: 'arch_tick',    label: '⑪ ／ 建築斜線' },
      { id: 'bar',          label: '⑫ ｜ 垂直止線' }
    ]
  };

  // ==================== 2. 建築・土木・設備・測量 略図雛形 120種カタログ ====================
  const PRESETS_120 = [
    // ① 基礎・躯体・配筋（30種：No.01〜No.25, No.101〜No.105）
    { key: 'blank', cat: 'struct', name: '⬜ 01. 白紙クリア', desc: 'キャンバスを真っ白にリセット' },
    { key: 'plan', cat: 'struct', name: '➕ 02. 通り芯平面図', desc: 'X/Y通り芯と躯体矩形ベース' },
    { key: 'section', cat: 'struct', name: '🏗️ 03. 基礎・地中梁断面図', desc: '地中梁断面＋ハッチング＋引出線' },
    { key: 'footing', cat: 'struct', name: '🧱 04. 独立フーチング基礎断面', desc: '割栗石・捨てコン・ベース筋断面' },
    { key: 'rebar', cat: 'struct', name: '🔩 05. 鉄筋配筋断面（かぶり厚）', desc: '主筋・帯筋・かぶり厚40mm表記' },
    { key: 'rebar_lap', cat: 'struct', name: '🔗 06. 鉄筋継手・定着長さ詳細', desc: '重ね継手長さ L=40d 確認図' },
    { key: 'slab_opening', cat: 'struct', name: '🕳️ 07. スラブ開口補強筋', desc: '開口四隅の45°斜め補強筋配置図' },
    { key: 'anchor_bolt', cat: 'struct', name: '🪛 08. アンカーボルト・ベース図', desc: '柱脚ベースプレート・出寸法確認' },
    { key: 'retaining_wall', cat: 'struct', name: '🛡️ 09. L型擁壁・RC壁断面図', desc: 'たて壁・底版・水抜き穴断面' },
    { key: 'column_beam', cat: 'struct', name: '🏛️ 10. 柱・梁仕口部 納まり図', desc: '柱主筋と梁主筋の交差部確認' },
    { key: 'col_hoop', cat: 'struct', name: '🔲 11. 柱主筋・フープ・中子筋詳細', desc: '帯筋135°フック・中子筋配置断面' },
    { key: 'slab_rebar', cat: 'struct', name: '📏 12. スラブ配筋（上下端・スペーサー）', desc: '上端筋・下端筋・馬スペーサー配置' },
    { key: 'haunch_beam', cat: 'struct', name: '📐 13. 地中梁ハンチ部 配筋納まり', desc: 'ハンチ傾斜・ハンチ筋定着詳細' },
    { key: 'pile_head', cat: 'struct', name: '🔩 14. 杭頭処理・杭頭補強筋詳細', desc: '既製杭・場所打ち杭の杭頭定着図' },
    { key: 'steel_joint', cat: 'struct', name: '⚙️ 15. 鉄骨梁継手・高力ボルト図', desc: 'スプライスプレート・ボルト本数確認' },
    { key: 'mat_foundation', cat: 'struct', name: '🏗️ 16. べた基礎・耐圧盤配筋断面', desc: '耐圧盤ダブル配筋・地中梁立上り' },
    { key: 'cantilever_slab', cat: 'struct', name: '📐 17. 片持ちスラブ・庇配筋詳細', desc: '上端主筋定着・先端かぶり厚確認' },
    { key: 'rc_wall_open', cat: 'struct', name: '🪟 18. RC耐力壁 開口補強筋詳細', desc: '縦補強筋・横補強筋・斜め筋配置' },
    { key: 'stud_bolt', cat: 'struct', name: '⚡ 19. 頭付きスタッドジベル溶接図', desc: 'デッキ上スタッドピッチ・打撃曲げ試験' },
    { key: 'deck_slab', cat: 'struct', name: '📏 20. デッキプレート合成スラブ断面', desc: '山高さ・溶接金網・コンクリート厚' },
    { key: 'rebar_gas_weld', cat: 'struct', name: '🔥 21. 鉄筋ガス圧接継手 膨らみ確認', desc: '膨らみ径1.4d以上・偏心量確認図' },
    { key: 'anchor_chem', cat: 'struct', name: '🧪 22. あと施工アンカー（ケミカル）', desc: '穿孔深さ・定着長・引張試験位置' },
    { key: 'level_conc', cat: 'struct', name: '📏 23. 土間コンクリート・ワイヤーメッシュ', desc: '防湿フィルム・砕石・メッシュ敷設' },
    { key: 'pit_wall', cat: 'struct', name: '🕳️ 24. ピット人通口・補強筋詳細', desc: '人通口スリーブ周囲補強配筋図' },
    { key: 'steel_base_mortar', cat: 'struct', name: '🧱 25. 鉄骨柱脚 無収縮モルタル充填', desc: 'ベースプレート下グラウト注入確認' },

    // ② 開口・階段・防水・仕上（30種：No.26〜No.50, No.106〜No.110）
    { key: 'opening', cat: 'finish', name: '🚧 26. 開口部・手すり養生計画', desc: '床開口部のバツ印と養生指示' },
    { key: 'sleeve', cat: 'finish', name: '⭕ 27. 貫通スリーブ納まり', desc: '梁貫通スリーブ位置と径表示' },
    { key: 'stair', cat: 'finish', name: '🪜 28. 階段・段差断面図', desc: '蹴上180・踏面260寸法の階段断面' },
    { key: 'slope', cat: 'finish', name: '♿ 29. スロープ勾配断面図', desc: 'バリアフリースロープ1/12勾配' },
    { key: 'waterproof', cat: 'finish', name: '💧 30. 屋上防水立上り断面', desc: 'パラペット防水立上り H=300以上' },
    { key: 'balcony_drain', cat: 'finish', name: '🌊 31. バルコニー側溝・ドレン', desc: '防水層・改修用ドレン納まり断面' },
    { key: 'sash_detail', cat: 'finish', name: '🪟 32. サッシ下枠・水切り断面', desc: '外部水切り・シーリング充填確認' },
    { key: 'partition_lgs', cat: 'finish', name: '🧱 33. LGS間仕切壁・PB二重張', desc: 'スタッド65形・石膏ボード断面' },
    { key: 'ceiling_susp', cat: 'finish', name: '📐 34. 天井吊りボルト・野縁組', desc: '吊りボルトピッチ・野縁受け断面' },
    { key: 'floor_double', cat: 'finish', name: '🪵 35. 二重床・防振支持脚断面', desc: 'スラブ上ふところ・支持脚確認' },
    { key: 'alc_wall', cat: 'finish', name: '🏢 36. ALC版・縦壁取付金物納まり', desc: 'イナズマプレート・目地シーリング' },
    { key: 'folded_roof', cat: 'finish', name: '🏠 37. 屋根折板葺き・タイトフレーム', desc: '母屋・タイトフレーム・断熱材断面' },
    { key: 'ub_step', cat: 'finish', name: '🛁 38. 水回り・ユニットバス床段差', desc: 'バリアフリー段差5mm以下確認図' },
    { key: 'tile_mortar', cat: 'finish', name: '💠 39. 外壁タイル張り・下地モルタル', desc: '躯体目荒らし・張付けモルタル厚' },
    { key: 'exp_joint', cat: 'finish', name: '↔️ 40. エキスパンションジョイント', desc: 'クリアランス幅・止水カバー断面' },
    { key: 'parapet_cap', cat: 'finish', name: '🏢 41. パラペット笠木・防水端末納まり', desc: 'アルミ笠木・防水層巻込み高さ確認' },
    { key: 'window_flashing', cat: 'finish', name: '🌧️ 42. 開口部先張り防水シート納まり', desc: 'サッシ周囲防水テープ・水切り重ね' },
    { key: 'insulation_wall', cat: 'finish', name: '❄️ 43. 外壁面 発泡ウレタン吹付断熱', desc: '断熱材吹付厚さ・熱橋部折り返し' },
    { key: 'curtain_wall', cat: 'finish', name: '🏙️ 44. カーテンウォール・ファスナー固定', desc: 'スラブ端ファスナー・層間塞ぎ納まり' },
    { key: 'handrail_anchor', cat: 'finish', name: '🛡️ 45. バルコニー手すり支柱・根元防水', desc: '支柱アンカー・シーリング防水処理' },
    { key: 'ceiling_brace', cat: 'finish', name: '📐 46. 特定天井 耐震ブレース配置断面', desc: '斜めブレース・クリアランス確保図' },
    { key: 'fire_door', cat: 'finish', name: '🚪 47. 防火戸(SD) 枠モルタル充填断面', desc: 'ドア枠周囲モルタル詰め・戸先隙間' },
    { key: 'urethane_roof', cat: 'finish', name: '💧 48. ウレタン塗膜防水 通気緩衝工法', desc: '通気シート・脱気筒・塗膜厚確認図' },
    { key: 'access_hatch', cat: 'finish', name: '🔲 49. 天井点検口・補強野縁納まり', desc: '点検口450角・吊りボルト補強配置' },
    { key: 'stone_dry', cat: 'finish', name: '🪨 50. 石張り乾式工法・ダボピン固定', desc: '躯体アンカー・L型金具・エポキシ充填' },

    // ③ 設備・配管・電気（29種：No.51〜No.74, No.111〜No.115）
    { key: 'piping', cat: 'mep', name: '🔧 51. 給水・排水管 系統ルート', desc: '給水管VP25・排水管VU75ルート図' },
    { key: 'drain_slope', cat: 'mep', name: '📉 52. 排水横引き管 勾配確認図', desc: '排水勾配 1/50・1/100 確認断面' },
    { key: 'duct_hvac', cat: 'mep', name: '🌬️ 53. 空調ダクト・梁下納まり', desc: 'スパイラルダクト・天井懐寸法' },
    { key: 'manhole_inv', cat: 'mep', name: '🕳️ 54. 排水桝・インバート断面', desc: '塩ビ桝・インバート底勾配確認' },
    { key: 'pit_piping', cat: 'mep', name: '🏗️ 55. 地下ピット貫通・止水図', desc: '地中壁貫通部止水プレート納まり' },
    { key: 'elec_conduit', cat: 'mep', name: '⚡ 56. 電気ケーブルラック断面', desc: '強電・弱電ラック離隔距離確認' },
    { key: 'outdoor_unit', cat: 'mep', name: '❄️ 57. 室外機架台・基礎納まり', desc: '防振ゴム・コンクリート基礎図' },
    { key: 'fire_hydrant', cat: 'mep', name: '🧯 58. 消火栓ボックス納まり図', desc: '壁埋込消火栓・立管接続確認' },
    { key: 'water_heater', cat: 'mep', name: '♨️ 59. 給湯器・エコキュート基礎配管', desc: 'タンク基礎アンカー・ヒートポンプ配管' },
    { key: 'fire_damper', cat: 'mep', name: '🔥 60. 防火区画貫通・FDダンパー', desc: '防火ダンパー・ロックウール充填詳細' },
    { key: 'elec_ground', cat: 'mep', name: '🔌 61. 電気分電盤・接地極(アース)図', desc: 'D種接地工事・アース棒埋設深度' },
    { key: 'solar_mount', cat: 'mep', name: '☀️ 62. 太陽光パネル架台・固定図', desc: '屋根金具固定・防水処理納まり' },
    { key: 'pump_pit', cat: 'mep', name: '💧 63. 湧水ピット・水中ポンプ配置', desc: 'ピット深さ・フロートスイッチ高さ' },
    { key: 'gas_pipe', cat: 'mep', name: '🔥 64. ガス配管・サヤ管ヘッダー図', desc: '防護管・埋設深度600mm以上確認' },
    { key: 'sprinkler_head', cat: 'mep', name: '💦 65. スプリンクラーヘッド・天井懐納まり', desc: '巻き出し管・デフレクター離隔距離' },
    { key: 'vent_cap', cat: 'mep', name: '🌬️ 66. 外壁換気フード・勾配スリーブ', desc: '外部下がり勾配・防水シーリング処理' },
    { key: 'grease_trap', cat: 'mep', name: '🛢️ 67. グリーストラップ埋設・蓋レベル', desc: '厨房排水流入管・トラップ桝断面' },
    { key: 'pipe_support', cat: 'mep', name: '🔩 68. 天井吊り配管・振れ止め支持金具', desc: '吊りバンド間隔・耐震振れ止め配置' },
    { key: 'lightning_rod', cat: 'mep', name: '⚡ 69. 避雷針・棟上げ導体取付詳細', desc: '屋上パラペット支持金物・接地線接続' },
    { key: 'ev_charger', cat: 'mep', name: '🚗 70. EV充電器スタンド基礎・配管図', desc: '駐車場基礎ブロック・地中埋設管引込' },
    { key: 'handhole_elec', cat: 'mep', name: '📦 71. 電気ハンドホール・地中電線管', desc: 'FEP管接続・砕石基礎・水抜き穴' },
    { key: 'cool_pipe', cat: 'mep', name: '❄️ 72. 冷媒配管・ドレン管保温巻き詳細', desc: 'ペアコイル・ドレン勾配・断熱材厚' },
    { key: 'water_tank', cat: 'mep', name: '🚰 73. 受水槽・高架水槽架台アンカー', desc: '防振架台・オーバーフロー管・通気管' },
    { key: 'fire_alarm', cat: 'mep', name: '🔔 74. 自火報感知器・天井配置離隔図', desc: '梁・吹出口からの離隔距離確認平面' },

    // ④ 仮設・安全・土木・測量（31種：No.75〜No.100, No.116〜No.120）
    { key: 'scaffold', cat: 'civil', name: '🦺 75. 外部足場・壁つなぎ安全図', desc: '外部枠組足場・壁つなぎ・親綱' },
    { key: 'guardrail', cat: 'civil', name: '🚧 76. 仮設手すり・中桟・巾木', desc: '手すりH=1100・中桟・巾木150' },
    { key: 'earthwork', cat: 'civil', name: '⛰️ 77. 掘削・根切り・砕石地業', desc: '根切り法面と砕石地業 t=100' },
    { key: 'sheeting', cat: 'civil', name: '🏗️ 78. 親杭横矢板・山留め断面', desc: 'H鋼親杭・木矢板・切梁支保工' },
    { key: 'road_pave', cat: 'civil', name: '🛣️ 79. 道路アスファルト舗装断面', desc: '表層・基層・上層/下層路盤工' },
    { key: 'u_ditch', cat: 'civil', name: '🌊 80. U字溝・グレーチング断面', desc: '道路側溝据付・基礎砕石・目地' },
    { key: 'curb_stone', cat: 'civil', name: '🧱 81. 歩車道境界ブロック断面', desc: '縁石据付・基礎コン・裏込め工' },
    { key: 'bench_mark', cat: 'civil', name: '📍 82. 仮ベンチマーク・水準測量', desc: 'KBMからの後視・前視高低差略図' },
    { key: 'batter_board', cat: 'civil', name: '📏 83. 水盛り遣り方・基準墨出し', desc: '杭・貫板・水糸による基準線図' },
    { key: 'crane_setup', cat: 'civil', name: '🏗️ 84. クレーン据付・敷鉄板図', desc: 'アウトリガー最大張出・養生範囲' },
    { key: 'traffic_guide', cat: 'civil', name: '🚦 85. 工事車両搬入・誘導員配置', desc: 'ゲート出入口・カラーコーン・誘導員' },
    { key: 'survey_cross', cat: 'civil', name: '📊 86. 横断測量 現況断面スケッチ', desc: '中心杭(CL)からの左右地盤高略図' },
    { key: 'box_culvert', cat: 'civil', name: '📦 87. ボックスカルバート据付断面', desc: '基礎砕石・目地止水・埋め戻し' },
    { key: 'wall_drain', cat: 'civil', name: '🪨 88. 擁壁裏込め砕石・透水マット', desc: '裏込め砕石幅・透水シート配置断面' },
    { key: 'slope_chouhari', cat: 'civil', name: '📐 89. 丁張り（水貫・斜め貫）法面図', desc: '法面勾配 1:1.5 丁張り設置略図' },
    { key: 'temp_elec', cat: 'civil', name: '⚡ 90. 仮設分電盤・工事看板安全配置', desc: '仮設電柱・漏電遮断器・保安灯配置' },
    { key: 'asagao_net', cat: 'civil', name: '🛡️ 91. 落下物防護棚（朝顔）・養生ネット', desc: '外部足場朝顔張出し角度・高さ確認' },
    { key: 'rolling_tower', cat: 'civil', name: '🪜 92. ローリングタワー（移動式足場）', desc: 'アウトリガー張出・手すり・脚輪ロック' },
    { key: 'trench_shore', cat: 'civil', name: '⛏️ 93. 管路掘削・簡易土留め建込断面', desc: '掘削深さ1.5m超の矢板・腹起し確認' },
    { key: 'gabion_slope', cat: 'civil', name: '🪨 94. じゃかご・布団かご法面保護断面', desc: '吸出し防止マット・詰石・法尻工' },
    { key: 'permeable_pave', cat: 'civil', name: '🌧️ 95. 透水性インターロッキング舗装', desc: 'クッション砂・透水性路盤・縁石納まり' },
    { key: 'temp_enclosure', cat: 'civil', name: '🚧 96. 仮囲い（万能鋼板）・控え柱断面', desc: '高さ2m/3m仮囲い・単管控え・ウエイト' },
    { key: 'wellpoint_drain', cat: 'civil', name: '💧 97. 釜場排水・ノッチタンク濁水処理', desc: '釜場ポンプ揚水・沈砂槽・放流ルート' },
    { key: 'traverse_survey', cat: 'civil', name: '🧭 98. トラバース（多角）測量 路線図', desc: '測点T1〜T4の夾角・辺長スケッチ' },
    { key: 'safety_passage', cat: 'civil', name: '🚶 99. 歩行者用仮設通路・スロープ養生', desc: 'カラーコーンバー・誘導灯・段差解消板' },
    { key: 'soil_compaction', cat: 'civil', name: '🚜 100. 路体盛土・層状転圧管理断面', desc: '仕上がり厚300mmごとの転圧回数管理図' },

    // ⑤ 追加拡張 20種（No.101〜No.120）
    { key: 'beam_diag_rebar', cat: 'struct', name: '💎 101. 地中梁貫通補強筋（ダイヤ筋）', desc: 'スリーブ周囲の斜め補強筋・あばら筋詳細' },
    { key: 'foundation_insul', cat: 'struct', name: '🧊 102. 基礎断熱・スタイロフォーム納まり', desc: '基礎立上り内側断熱材・防蟻処理断面' },
    { key: 'steel_web_hole', cat: 'struct', name: '⭕ 103. 鉄骨梁貫通孔・補強リング詳細', desc: 'H形鋼ウェブ貫通スリーブ・溶接補強リング' },
    { key: 'stair_landing_rebar', cat: 'struct', name: '🪜 104. 階段踊り場・ささら桁配筋断面', desc: '段鼻筋・踊り場スラブ定着配筋図' },
    { key: 'cb_wall_rebar', cat: 'struct', name: '🧱 105. 境界塀・CBブロック擁壁配筋断面', desc: '縦筋・横筋・控壁・基礎コン断面' },

    { key: 'roof_drain_detail', cat: 'finish', name: '🕳️ 106. 屋上ルーフドレン防水納まり', desc: '鋳鉄製ドレン・増張り防水シート押え' },
    { key: 'entrance_sill', cat: 'finish', name: '🚪 107. 玄関ドア下枠・沓摺り防水納まり', desc: 'ステンレス沓摺り・モルタル充填・止水' },
    { key: 'eave_vent', cat: 'finish', name: '🌬️ 108. 軒天換気口・防火ダンパー納まり', desc: '不燃軒天ボード・有孔換気金物断面' },
    { key: 'floor_trim', cat: 'finish', name: '📏 109. 床見切り材・異種床材段差納まり', desc: 'タイルカーペットと長尺シート見切り' },
    { key: 'siding_vent', cat: 'finish', name: '🏠 110. 外壁サイディング通気胴縁・水切り', desc: '通気層15mm・防虫網・土台水切り断面' },

    { key: 'water_meter_box', cat: 'mep', name: '🚰 111. 屋外給水メーター・止水栓ボックス', desc: '量水器筐・逆止弁・埋設給水管接続' },
    { key: 'drain_air_valve', cat: 'mep', name: '🌬️ 112. 空調ドレンアップ・通気弁（ドルゴ）', desc: '排水立て管頂部通気弁・トラップ封水保護' },
    { key: 'temp_power_panel', cat: 'mep', name: '⚡ 113. 仮設工事用分電盤・漏電遮断系統', desc: '主幹ELB・分岐ブレーカー・接地抵抗確認' },
    { key: 'ceiling_light_cut', cat: 'mep', name: '💡 114. 照明器具・天井ボード開口補強位置', desc: 'ダウンライト埋込穴・野縁干渉回避図' },
    { key: 'outdoor_pipe_rack', cat: 'mep', name: '🔩 115. 屋外露出配管・保温ラッキング納まり', desc: 'カラー鋼板ラッキング・支持金物ピッチ' },

    { key: 'steel_plate_ramp', cat: 'civil', name: '🛣️ 116. 敷鉄板・仮設構台乗り入れスロープ', desc: '歩道切り下げ養生・敷鉄板溶接連結図' },
    { key: 'catch_basin_detail', cat: 'civil', name: '🌊 117. 集水桝・泥溜め・グレーチング詳細', desc: '泥溜め深さ150mm・流出管インバート' },
    { key: 'heavy_machinery_zone', cat: 'civil', name: '🚜 118. 重機作業半径・立入禁止バリケード', desc: 'バックホウ旋回半径・誘導員・単管柵配置' },
    { key: 'boundary_stake', cat: 'civil', name: '📍 119. 境界杭（コンクリート杭・金属標）', desc: '引照点2点からの距離控・境界標復元図' },
    { key: 'weep_hole_filter', cat: 'civil', name: '💧 120. 擁壁水抜き穴・裏込めフィルタ施工図', desc: '吸出し防止材・砕石フィルタ・塩ビ管勾配' }
  ];

  function getMamezuPresetCounts() {
    const counts = { all: PRESETS_120.length, struct: 0, finish: 0, mep: 0, civil: 0 };
    PRESETS_120.forEach(item => {
      if (item && typeof counts[item.cat] === 'number') counts[item.cat]++;
    });
    return counts;
  }

  function buildPresetObjects120(key) {
    if (!key || key === 'blank') return [];

    const c = '#0f172a', r = '#dc2626', b = '#2563eb', g = '#059669', gy = '#64748b';
    const L = (x1, y1, x2, y2, col = c, sw = 4, ls = 'solid', a1 = 'none', a2 = 'none') => ({
      type: 'line', x1, y1, x2, y2, color: col, strokeWidth: sw, lineStyle: ls, dashPattern: 'none', arrowStart: a1, arrowEnd: a2, opacity: 100
    });
    const R = (x, y, w, h, col = c, sw = 4, ls = 'solid', fillTint = false) => ({
      type: 'rect', x, y, w, h, color: col, strokeWidth: sw, lineStyle: ls, dashPattern: 'none', fillTint, opacity: 100
    });
    const C = (x, y, w, h, col = b, sw = 4, fillTint = true) => ({
      type: 'circle', x, y, w, h, color: col, strokeWidth: sw, lineStyle: 'solid', dashPattern: 'none', fillTint, opacity: 100
    });
    const H = (x, y, w, h, pat = 'diag45', col = gy) => ({
      type: 'hatch', x, y, w, h, color: col, strokeWidth: 2, lineStyle: 'solid', dashPattern: 'none', hatchPattern: pat, opacity: 100
    });
    const LD = (x1, y1, x2, y2, text, col = r, a1 = 'filled', a2 = 'none') => ({
      type: 'leader', x1, y1, x2, y2, text, color: col, textColor: '', fontSize: 21, strokeWidth: 3.5, lineStyle: 'solid', dashPattern: 'none', arrowStart: a1, arrowEnd: a2, opacity: 100
    });
    const T = (x, y, text, col = c, fontSize = 24, boxStyle = 'none') => ({
      type: 'text', x, y, text, color: col, fontSize, textBoxStyle: boxStyle, opacity: 100
    });
    const D = (x1, y1, x2, y2, text, col = b, dimOffset = 0, dimExtStyle = 'tick_short') => ({
      type: 'dimension', x1, y1, x2, y2, text, dimOffset, textPos: 'center', dimExtStyle, color: col, strokeWidth: 2.5, lineStyle: 'solid', dashPattern: 'none', opacity: 100
    });
    const CL = (x, y, w, h, col = r) => ({
      type: 'cloud', x, y, w, h, color: col, strokeWidth: 3.5, lineStyle: 'solid', dashPattern: 'none', fillTint: false, opacity: 100
    });

    const map = {
      // ① 基礎・躯体・配筋（No.02〜No.25）
      plan: [L(120, 280, 840, 280, b, 3, 'dashdot'), L(480, 60, 480, 500, b, 3, 'dashdot'), R(280, 150, 400, 260, c, 4), T(128, 268, 'Y1通り', b, 24), T(492, 88, 'X3通り', b, 24), { type: 'compass', x1: 840, y1: 100, x2: 840, y2: 55, color: c, opacity: 100 }],
      section: [R(220, 300, 520, 130, c, 4), R(390, 130, 180, 170, c, 4), H(224, 304, 512, 122, 'diag45', gy), LD(480, 220, 650, 120, '地中梁 450×800', r)],
      footing: [R(240, 340, 480, 90, c, 4), R(410, 140, 140, 200, c, 4), H(220, 430, 520, 45, 'concrete', gy), H(220, 475, 520, 45, 'gravel', gy), LD(320, 450, 140, 380, '捨てコン t=50', b), LD(620, 495, 730, 430, '砕石地業 t=150', b)],
      rebar: [R(260, 100, 440, 360, c, 4), R(310, 150, 340, 260, r, 4), C(315, 155, 22, 22, r), C(623, 155, 22, 22, r), C(315, 383, 22, 22, r), C(623, 383, 22, 22, r), LD(285, 280, 150, 210, 'かぶり厚 40mm以上', b)],
      rebar_lap: [L(160, 260, 560, 260, r, 5), L(400, 285, 800, 285, b, 5), D(400, 220, 560, 220, '継手長さ L=40d', r), T(220, 240, '主筋 D19', r, 22), T(620, 325, '継手相手筋', b, 22)],
      slab_opening: [R(180, 90, 600, 380, c, 3, 'dashed'), R(380, 200, 200, 160, c, 4, 'solid', true), L(310, 270, 450, 130, r, 4), L(510, 130, 650, 270, r, 4), L(310, 290, 450, 430, r, 4), L(510, 430, 650, 290, r, 4), LD(580, 200, 690, 120, '開口補強筋 2-D13', r)],
      anchor_bolt: [R(220, 320, 520, 140, c, 4), H(224, 324, 512, 132, 'concrete', gy), R(340, 295, 280, 25, b, 4, 'solid', true), R(420, 110, 120, 185, c, 4), L(375, 255, 375, 410, r, 5), L(585, 255, 585, 410, r, 5), LD(585, 270, 700, 190, 'アンカーボルト M20', r)],
      retaining_wall: [L(240, 100, 310, 100, c, 4), L(310, 100, 340, 370, c, 4), L(340, 370, 660, 370, c, 4), L(660, 370, 660, 440, c, 4), L(240, 440, 660, 440, c, 4), L(240, 100, 240, 440, c, 4), C(325, 280, 24, 24, b), LD(337, 292, 490, 220, '水抜きパイプ φ50', b)],
      column_beam: [R(380, 70, 200, 420, c, 4), R(160, 190, 640, 150, c, 4), L(405, 85, 405, 475, r, 3, 'dashed'), L(555, 85, 555, 475, r, 3, 'dashed'), L(175, 215, 785, 215, b, 3, 'dashed'), L(175, 315, 785, 315, b, 3, 'dashed'), LD(480, 265, 650, 120, '仕口部帯筋確認', r)],
      col_hoop: [R(290, 90, 380, 380, c, 4), R(335, 135, 290, 290, r, 4), L(480, 135, 480, 425, b, 3.5), L(335, 280, 625, 280, b, 3.5), LD(480, 210, 650, 130, '中子筋・135°フック確認', r)],
      slab_rebar: [R(160, 190, 640, 180, c, 4), L(180, 225, 780, 225, r, 4), L(180, 335, 780, 335, b, 4), R(340, 225, 24, 110, g, 3), R(580, 225, 24, 110, g, 3), LD(352, 275, 450, 130, 'スペーサー・上端筋高さ確認', r)],
      haunch_beam: [L(160, 160, 800, 160, c, 4), L(160, 340, 360, 340, c, 4), L(360, 340, 480, 440, c, 4), L(480, 440, 800, 440, c, 4), L(340, 315, 495, 415, r, 4, 'dashed'), LD(420, 390, 560, 260, 'ハンチ斜め補強筋', r)],
      pile_head: [R(240, 130, 480, 180, c, 4), R(380, 310, 200, 180, gy, 4, 'solid', true), L(415, 170, 415, 360, r, 4.5), L(545, 170, 545, 360, r, 4.5), LD(545, 240, 660, 160, '杭頭補強筋 定着長確認', r)],
      steel_joint: [R(160, 190, 310, 180, c, 4), R(490, 190, 310, 180, c, 4), R(360, 220, 240, 120, b, 4, 'solid', true), C(390, 245, 18, 18, r), C(390, 295, 18, 18, r), C(550, 245, 18, 18, r), C(550, 295, 18, 18, r), LD(559, 254, 650, 130, '高力ボルト本締・マーキング', r)],
      mat_foundation: [R(180, 320, 600, 110, c, 4), R(410, 170, 140, 150, c, 4), L(200, 345, 760, 345, r, 3.5), L(200, 405, 760, 405, b, 3.5), LD(560, 345, 680, 220, '耐圧盤 上下ダブル配筋', r)],
      cantilever_slab: [R(220, 130, 140, 310, c, 4), R(360, 180, 380, 75, c, 4), L(250, 200, 710, 200, r, 4.5), LD(540, 200, 630, 120, '片持ちスラブ上端主筋', r)],
      rc_wall_open: [R(200, 90, 560, 380, c, 4), R(380, 190, 200, 180, c, 4, 'solid', true), L(360, 165, 360, 395, r, 4), L(600, 165, 600, 395, r, 4), L(350, 170, 610, 170, b, 4), LD(600, 260, 660, 140, '開口縦横補強筋 2-D16', r)],
      stud_bolt: [R(220, 320, 520, 45, c, 5), R(455, 220, 50, 100, r, 4, 'solid', true), R(440, 205, 80, 15, r, 4, 'solid', true), LD(505, 250, 630, 160, '頭付きスタッド溶接確認', r)],
      deck_slab: [L(160, 360, 260, 360, c, 4), L(260, 360, 290, 310, c, 4), L(290, 310, 390, 310, c, 4), L(390, 310, 420, 360, c, 4), L(420, 360, 540, 360, c, 4), L(540, 360, 570, 310, c, 4), L(570, 310, 670, 310, c, 4), L(670, 310, 700, 360, c, 4), L(700, 360, 800, 360, c, 4), L(160, 210, 800, 210, c, 4), L(180, 245, 780, 245, r, 3, 'dashed'), T(380, 275, '溶接金網・コンクリート厚', b, 22)],
      rebar_gas_weld: [L(160, 280, 450, 280, c, 7), L(510, 280, 800, 280, c, 7), C(445, 255, 70, 50, r, 4, true), LD(480, 255, 580, 150, '膨らみ径 1.4d以上・偏心確認', r)],
      anchor_chem: [R(220, 260, 520, 180, c, 4), H(224, 264, 512, 172, 'concrete', gy), R(462, 150, 36, 200, b, 4, 'solid', true), LD(498, 290, 620, 180, 'ケミカルアンカー定着長', r)],
      level_conc: [R(180, 250, 600, 85, c, 4), L(180, 290, 780, 290, r, 3.5, 'dashed'), H(180, 335, 600, 65, 'gravel', gy), LD(520, 290, 630, 160, 'ワイヤーメッシュ φ6@150', r)],
      pit_wall: [R(220, 110, 520, 340, c, 4), C(410, 210, 140, 140, b, 4, true), R(385, 185, 190, 190, r, 3, 'dashed'), LD(550, 280, 650, 150, '人通口周囲補強筋', r)],
      steel_base_mortar: [R(240, 330, 480, 120, c, 4), R(330, 295, 300, 35, g, 3, 'solid', true), R(310, 265, 340, 30, b, 4), R(420, 110, 120, 155, c, 4), LD(630, 312, 700, 200, '無収縮モルタル充填', g)],

      // ② 開口・階段・防水・仕上（No.26〜No.50）
      opening: [R(280, 140, 400, 280, c, 4), L(280, 140, 680, 420, r, 3.5, 'dashed'), L(680, 140, 280, 420, r, 3.5, 'dashed'), T(395, 290, '床開口養生', r, 28), CL(260, 120, 440, 320, r)],
      sleeve: [R(180, 120, 600, 320, c, 4), C(410, 210, 140, 140, b, 4, true), LD(480, 280, 650, 170, '貫通スリーブ φ100', r)],
      stair: [L(160, 440, 320, 440, c, 4), L(320, 440, 320, 350, c, 4), L(320, 350, 460, 350, c, 4), L(460, 350, 460, 260, c, 4), L(460, 260, 600, 260, c, 4), LD(460, 305, 610, 380, '蹴上180 / 踏面260', r)],
      slope: [L(140, 410, 820, 410, c, 4), L(140, 410, 740, 250, b, 4), L(740, 250, 820, 250, c, 4), { type: 'slope', x1: 280, y1: 330, x2: 600, y2: 250, text: '1/12', color: r, strokeWidth: 3.5, opacity: 100 }],
      waterproof: [R(180, 340, 600, 90, c, 4), R(180, 130, 110, 210, c, 4), L(295, 160, 295, 335, b, 5), L(295, 335, 760, 335, b, 5), LD(295, 230, 450, 160, '防水立上り H=300以上', r)],
      balcony_drain: [R(160, 310, 640, 110, c, 4), R(620, 310, 90, 65, b, 4, 'solid', true), L(160, 295, 620, 310, g, 4), LD(665, 340, 720, 220, '改修用ドレン設置', r)],
      sash_detail: [R(220, 120, 140, 140, c, 4), R(220, 340, 140, 130, c, 4), R(255, 260, 70, 80, b, 3, 'solid', true), L(215, 340, 140, 365, r, 4), LD(215, 340, 110, 270, 'シーリング・外部水切り', r)],
      partition_lgs: [R(240, 90, 480, 40, c, 4), R(240, 430, 480, 40, c, 4), R(435, 130, 90, 300, b, 3), R(415, 130, 20, 300, g, 3, 'solid', true), R(525, 130, 20, 300, g, 3, 'solid', true), LD(545, 260, 660, 200, 'LGS65＋PB12.5×2枚', r)],
      ceiling_susp: [R(180, 90, 600, 55, c, 4), L(320, 145, 320, 360, b, 3), L(640, 145, 640, 360, b, 3), R(220, 360, 520, 24, g, 3), R(200, 384, 560, 18, c, 3), LD(320, 240, 430, 195, '吊りボルト @900', r)],
      floor_double: [R(160, 370, 640, 90, c, 4), R(160, 255, 640, 24, g, 3, 'solid', true), R(260, 279, 24, 91, b, 3), R(470, 279, 24, 91, b, 3), R(680, 279, 24, 91, b, 3), LD(482, 325, 580, 195, '二重床支持脚・配管懐', r)],
      alc_wall: [R(360, 90, 100, 380, c, 4), R(475, 90, 100, 380, c, 4), R(460, 90, 15, 380, b, 2, 'solid', true), LD(467, 250, 610, 170, '縦目地シーリング充填', r)],
      folded_roof: [L(160, 320, 240, 230, c, 4), L(240, 230, 340, 230, c, 4), L(340, 230, 420, 320, c, 4), L(420, 320, 520, 320, c, 4), L(520, 320, 600, 230, c, 4), L(600, 230, 700, 230, c, 4), L(700, 230, 780, 320, c, 4), R(220, 320, 520, 40, b, 3), LD(470, 320, 580, 160, 'タイトフレーム溶接確認', r)],
      ub_step: [R(180, 310, 280, 120, c, 4), R(460, 315, 320, 115, b, 4), D(460, 260, 460, 315, '段差5mm以下', r), T(240, 290, '廊下床FL', c, 22), T(540, 295, 'UB洗い場床', b, 22)],
      tile_mortar: [R(260, 100, 160, 360, c, 4), H(264, 104, 152, 352, 'concrete', gy), R(420, 100, 45, 360, g, 3, 'solid', true), R(465, 100, 25, 360, b, 3), LD(442, 240, 550, 170, '張付けモルタル厚・密着確認', r)],
      exp_joint: [R(180, 220, 260, 180, c, 4), R(520, 220, 260, 180, c, 4), R(420, 195, 120, 25, r, 4, 'solid', true), D(440, 280, 520, 280, 'クリアランス 80mm', b)],
      parapet_cap: [R(260, 170, 130, 270, c, 4), R(240, 135, 170, 35, b, 4, 'solid', true), L(395, 160, 395, 430, r, 4), LD(410, 152, 540, 120, 'アルミ笠木・防水巻込み', r)],
      window_flashing: [R(280, 130, 120, 290, c, 4), R(310, 200, 60, 150, b, 4, 'solid', true), L(270, 350, 420, 350, r, 5), LD(270, 350, 120, 260, '先張り防水シート・水切り', r)],
      insulation_wall: [R(240, 110, 120, 340, c, 4), H(360, 110, 55, 340, 'insulation', '#f59e0b'), LD(415, 250, 540, 170, '吹付硬質ウレタンフォーム t=35', r)],
      curtain_wall: [R(180, 230, 360, 90, c, 4), R(580, 110, 70, 340, b, 4, 'solid', true), R(520, 210, 60, 45, r, 3, 'solid', true), LD(550, 210, 670, 140, 'ファスナー固定・層間塞ぎ', r)],
      handrail_anchor: [R(200, 340, 560, 100, c, 4), R(460, 140, 40, 200, b, 4, 'solid', true), R(445, 325, 70, 15, r, 3, 'solid', true), LD(515, 330, 630, 220, '手すり支柱根元シーリング防水', r)],
      ceiling_brace: [R(180, 90, 600, 45, c, 4), L(300, 135, 300, 380, b, 3), L(660, 135, 660, 380, b, 3), L(300, 135, 520, 380, r, 4), L(660, 135, 440, 380, r, 4), R(220, 380, 520, 20, c, 3), LD(540, 260, 680, 220, '耐震斜めブレース補強', r)],
      fire_door: [R(240, 110, 110, 340, c, 4), R(610, 110, 110, 340, c, 4), R(350, 130, 260, 320, b, 3), R(350, 130, 25, 320, r, 3, 'solid', true), LD(362, 230, 440, 170, '防火戸枠モルタル充填', r)],
      urethane_roof: [R(180, 340, 600, 100, c, 4), L(180, 330, 780, 330, g, 4, 'dashed'), L(180, 318, 780, 318, b, 5), R(620, 220, 45, 110, r, 4, 'solid', true), LD(642, 220, 440, 150, '通気緩衝シート・脱気筒設置', r)],
      access_hatch: [R(280, 140, 400, 280, c, 4), R(320, 180, 320, 200, b, 3, 'dashed'), C(300, 160, 16, 16, r), C(660, 160, 16, 16, r), C(300, 400, 16, 16, r), C(660, 400, 16, 16, r), T(420, 285, '点検口 450角', b, 24)],
      stone_dry: [R(240, 110, 140, 340, c, 4), R(450, 110, 45, 340, gy, 4, 'solid', true), R(380, 265, 70, 25, r, 3, 'solid', true), LD(415, 265, 530, 180, '乾式L型金具・ダボピン固定', r)],

      // ③ 設備・配管・電気（No.51〜No.74）
      piping: [L(140, 250, 450, 250, b, 4.5, 'pipe_water', 'circle', 'filled'), L(450, 320, 810, 320, r, 4.5, 'pipe_drain', 'none', 'filled'), T(190, 228, '給水管 VP25', b, 24), T(510, 298, '排水管 VU75', r, 24)],
      drain_slope: [L(160, 220, 800, 290, r, 5, 'pipe_drain', 'none', 'filled'), L(160, 220, 800, 220, gy, 2, 'dashed'), { type: 'slope', x1: 300, y1: 185, x2: 640, y2: 222, text: '1/100', color: b, strokeWidth: 3.5, opacity: 100 }],
      duct_hvac: [R(160, 80, 640, 110, c, 4), R(340, 230, 280, 110, b, 4, 'solid', true), L(160, 410, 800, 410, g, 3, 'dashdot'), D(660, 190, 660, 410, '天井懐 H', r)],
      manhole_inv: [R(330, 120, 300, 330, c, 4), L(150, 290, 330, 310, b, 5), L(630, 330, 810, 350, b, 5), H(334, 340, 292, 106, 'concrete', gy), LD(480, 340, 670, 210, 'インバート底勾配形成', r)],
      pit_piping: [R(430, 90, 100, 380, c, 4), H(434, 94, 92, 372, 'concrete', gy), L(180, 280, 780, 280, b, 6), R(468, 235, 24, 90, r, 4, 'solid', true), LD(480, 235, 610, 150, '止水プレート溶接', r)],
      elec_conduit: [R(180, 90, 600, 50, c, 4), L(240, 240, 720, 240, b, 5, 'elec_wire'), L(240, 275, 720, 275, b, 5), L(240, 345, 720, 345, g, 4, 'dashed'), LD(480, 240, 590, 175, '強電ケーブルラック', b), LD(480, 345, 590, 415, '弱電ラック(離隔確保)', g)],
      outdoor_unit: [R(220, 390, 520, 60, c, 4), R(300, 330, 360, 60, gy, 3, 'solid', true), R(320, 150, 320, 180, b, 4), LD(310, 330, 160, 250, '防振架台・アンカー固定', r)],
      fire_hydrant: [R(360, 120, 240, 320, r, 4, 'solid', true), L(480, 440, 480, 510, r, 5), T(425, 275, '消火栓BOX', r, 24), LD(480, 475, 630, 475, '消火立管 65A', b)],
      water_heater: [R(220, 390, 240, 60, c, 4), R(260, 150, 160, 240, b, 4, 'solid', true), R(540, 270, 180, 120, g, 4), L(420, 330, 540, 330, r, 4), LD(340, 390, 140, 310, '貯湯タンク脚部アンカー', r)],
      fire_damper: [R(430, 90, 100, 380, c, 4), R(200, 220, 560, 120, b, 3), R(445, 210, 70, 140, r, 4, 'solid', true), LD(480, 210, 610, 130, '防火ダンパー(FD)・耐火充填', r)],
      elec_ground: [R(240, 110, 160, 200, c, 4), L(320, 310, 320, 410, g, 4), L(180, 410, 780, 410, c, 4), L(540, 410, 540, 495, r, 6), L(320, 410, 540, 410, g, 4), LD(540, 455, 630, 340, 'D種接地極 埋設深度確認', r)],
      solar_mount: [L(160, 360, 800, 240, c, 5), L(240, 300, 720, 210, b, 6), R(320, 285, 30, 35, r, 3), R(600, 232, 30, 35, r, 3), LD(615, 232, 680, 140, '架台支持金具・防水処理', r)],
      pump_pit: [R(320, 180, 320, 280, c, 4), R(420, 340, 100, 110, b, 4, 'solid', true), L(470, 340, 470, 120, b, 5), L(470, 120, 740, 120, b, 5, 'solid', 'none', 'filled'), LD(470, 380, 680, 260, '水中ポンプ・フロート位置', r)],
      gas_pipe: [L(140, 200, 820, 200, c, 4), L(160, 370, 800, 370, g, 8), L(160, 370, 800, 370, '#fef08a', 4), D(300, 200, 300, 370, '埋設深 600以上', r), T(420, 350, 'ガス管＋防護サヤ管', g, 22)],
      sprinkler_head: [R(180, 90, 600, 45, c, 4), L(240, 220, 520, 220, b, 5), L(520, 220, 520, 360, b, 4), R(180, 360, 600, 18, c, 3), C(505, 378, 30, 22, r, 3, true), LD(535, 388, 630, 290, 'SPヘッド・天井面納まり', r)],
      vent_cap: [R(430, 100, 100, 360, c, 4), L(240, 250, 660, 285, b, 6), C(645, 255, 55, 65, r, 4, true), LD(672, 255, 560, 150, '外部下がり勾配・換気フード', r)],
      grease_trap: [R(310, 180, 340, 250, c, 4), L(150, 240, 310, 250, b, 5), L(650, 270, 810, 280, b, 5), L(430, 180, 430, 340, g, 4), L(540, 240, 540, 430, g, 4), T(390, 160, 'グリーストラップ断面', c, 22)],
      pipe_support: [R(180, 90, 600, 45, c, 4), L(480, 135, 480, 290, b, 3.5), L(220, 290, 740, 290, g, 6), L(480, 290, 640, 135, r, 3.5, 'dashed'), LD(560, 210, 670, 210, '吊りバンド・耐震振れ止め', r)],
      lightning_rod: [R(260, 320, 440, 120, c, 4), L(480, 110, 480, 320, r, 5), L(480, 270, 700, 270, g, 4), LD(480, 150, 580, 140, '突針・棟上げ導体接続確認', r)],
      ev_charger: [R(340, 360, 280, 85, c, 4), R(420, 160, 120, 200, b, 4, 'solid', true), L(200, 410, 480, 410, g, 5), T(440, 260, 'EV充電器', b, 20), LD(340, 410, 150, 310, '地中FEP管引込・基礎固定', r)],
      handhole_elec: [R(330, 160, 300, 260, c, 4), L(150, 290, 330, 290, b, 6), L(630, 290, 810, 290, b, 6), H(310, 420, 340, 45, 'gravel', gy), T(385, 140, '電気ハンドホール', c, 22)],
      cool_pipe: [R(220, 240, 520, 55, b, 4, 'solid', true), R(220, 315, 520, 40, g, 4, 'solid', true), LD(520, 240, 610, 150, '冷媒ペアコイル(保温厚20mm)', b), LD(520, 355, 610, 430, '断熱ドレン管(勾配1/100)', g)],
      water_tank: [R(220, 390, 520, 60, c, 4), R(290, 355, 380, 35, gy, 3, 'solid', true), R(310, 140, 340, 215, b, 4, 'solid', true), LD(650, 230, 700, 150, '受水槽・防振架台固定', r)],
      fire_alarm: [R(220, 110, 520, 340, c, 4), C(455, 255, 50, 50, r, 4, true), D(220, 280, 455, 280, '壁面離隔 0.6m以上', b), T(420, 240, '煙感知器', r, 22)],

      // ④ 仮設・安全・土木・測量（No.75〜No.100）
      scaffold: [R(340, 100, 380, 370, c, 4), L(240, 80, 240, 470, b, 4), L(170, 80, 170, 470, b, 4), L(170, 200, 340, 200, r, 4), L(170, 340, 340, 340, r, 4), LD(240, 200, 50, 140, '壁つなぎ・親綱確認', r)],
      guardrail: [L(200, 430, 760, 430, c, 5), L(240, 210, 240, 430, b, 4), L(720, 210, 720, 430, b, 4), L(220, 210, 740, 210, r, 4), L(240, 320, 720, 320, r, 3, 'dashed'), R(240, 402, 480, 28, g, 3, 'solid', true), D(175, 210, 175, 430, 'H=1100', b)],
      earthwork: [L(100, 160, 280, 160, c, 4, 'earth_ground'), L(280, 160, 370, 410, c, 4), L(370, 410, 590, 410, c, 4), L(590, 410, 680, 160, c, 4), L(680, 160, 860, 160, c, 4, 'earth_ground'), H(370, 410, 220, 35, 'gravel', gy), T(390, 475, '砕石地業 t=100', b, 22)],
      sheeting: [R(250, 90, 45, 400, c, 4, 'solid', true), H(120, 150, 130, 320, 'diag45', gy), L(295, 220, 680, 220, b, 6), L(295, 360, 680, 360, b, 6), LD(295, 220, 480, 140, '親杭横矢板・腹起し切梁', r)],
      road_pave: [R(220, 160, 520, 45, c, 3, 'solid', true), R(220, 205, 520, 55, b, 3), R(220, 260, 520, 90, g, 3), H(220, 350, 520, 90, 'gravel', gy), LD(740, 182, 790, 130, '表層(密粒As) t=50', r), LD(740, 305, 790, 305, '砕石路盤 t=150', b)],
      u_ditch: [L(340, 180, 340, 410, c, 4), L(340, 410, 620, 410, c, 4), L(620, 410, 620, 180, c, 4), L(395, 180, 395, 355, c, 4), L(395, 355, 565, 355, c, 4), L(565, 355, 565, 180, c, 4), R(340, 160, 280, 20, b, 4, 'solid', true), H(320, 410, 320, 45, 'gravel', gy), LD(480, 160, 650, 110, 'グレーチング蓋', b)],
      curb_stone: [R(420, 150, 110, 210, c, 4), H(390, 360, 180, 60, 'concrete', gy), L(150, 220, 420, 220, g, 4), L(530, 310, 810, 310, b, 4), T(220, 205, '歩道面', g, 22), T(630, 295, '車道面', b, 22)],
      bench_mark: [R(140, 350, 140, 80, c, 4), L(480, 190, 480, 390, r, 4), L(140, 220, 800, 220, b, 3, 'dashed'), L(210, 220, 210, 350, g, 3, 'filled', 'filled'), L(740, 220, 740, 390, r, 3, 'filled', 'filled'), { type: 'level', x: 150, y: 350, text: 'KBM +10.000', color: r, opacity: 100 }, T(225, 290, '後視(BS)', g, 20), T(755, 310, '前視(FS)', r, 20)],
      batter_board: [L(220, 160, 220, 440, c, 5), L(740, 160, 740, 440, c, 5), R(190, 210, 580, 28, g, 3, 'solid', true), L(150, 280, 810, 280, r, 3, 'dashed'), LD(480, 280, 580, 150, '基準水糸（FL+500）', r)],
      crane_setup: [R(360, 180, 240, 180, b, 4, 'solid', true), R(280, 130, 60, 60, r, 3, 'solid', true), R(620, 130, 60, 60, r, 3, 'solid', true), R(280, 350, 60, 60, r, 3, 'solid', true), R(620, 350, 60, 60, r, 3, 'solid', true), C(250, 40, 460, 460, r, 3, false), LD(650, 160, 740, 100, '敷鉄板養生・最大張出', r)],
      traffic_guide: [L(140, 160, 820, 160, c, 4), L(140, 400, 820, 400, c, 4), L(200, 280, 680, 280, b, 5, 'arrow_flow', 'none', 'filled'), C(710, 255, 50, 50, r, 4, true), T(690, 240, '誘導員', r, 22), T(310, 255, '工事車両進入ルート', b, 22)],
      survey_cross: [L(120, 330, 300, 310, c, 4), L(300, 310, 480, 260, c, 4), L(480, 260, 660, 290, c, 4), L(660, 290, 840, 340, c, 4), L(480, 120, 480, 450, r, 3, 'dashdot'), T(490, 145, '中心杭 CL', r, 22), T(210, 295, '左(L)', b, 20), T(720, 285, '右(R)', b, 20)],
      box_culvert: [R(320, 170, 320, 250, c, 5), R(365, 215, 230, 160, c, 4), H(290, 420, 380, 50, 'gravel', gy), LD(640, 280, 720, 180, 'ボックスカルバート・目地防水', r)],
      wall_drain: [R(260, 110, 90, 350, c, 4), H(350, 150, 140, 310, 'gravel', gy), L(490, 150, 490, 460, b, 4, 'dashed'), L(350, 390, 490, 390, b, 5), LD(420, 260, 560, 180, '裏込め砕石＋透水マット', b)],
      slope_chouhari: [L(140, 430, 320, 430, c, 4), L(320, 430, 580, 170, c, 4), L(580, 170, 820, 170, c, 4), L(260, 220, 260, 460, g, 4), R(220, 260, 180, 22, g, 3), L(280, 450, 560, 170, r, 3, 'dashed'), LD(420, 310, 550, 360, '法面丁張り（水貫・斜め貫）', r)],
      temp_elec: [L(240, 90, 240, 460, c, 7), R(255, 190, 120, 160, b, 4, 'solid', true), L(315, 350, 315, 460, g, 4), T(270, 275, '仮設盤', b, 22), R(520, 240, 220, 150, r, 3, 'solid', true), T(555, 320, '工事安全看板', r, 22)],
      asagao_net: [R(420, 90, 320, 380, c, 4), L(350, 80, 350, 470, b, 4), L(350, 250, 160, 160, r, 5), L(350, 330, 230, 215, g, 3), LD(220, 190, 80, 120, '防護棚(朝顔)角度・高さ確認', r)],
      rolling_tower: [R(360, 130, 240, 310, b, 4), L(360, 230, 600, 230, b, 3), L(360, 330, 600, 330, b, 3), L(360, 440, 280, 440, r, 5), L(600, 440, 680, 440, r, 5), C(365, 440, 24, 24, c), C(575, 440, 24, 24, c), LD(640, 440, 680, 330, 'アウトリガー張出・脚輪ロック', r)],
      trench_shore: [L(140, 160, 330, 160, c, 4), L(330, 160, 330, 430, c, 4), L(330, 430, 630, 430, c, 4), L(630, 430, 630, 160, c, 4), L(630, 160, 820, 160, c, 4), R(330, 140, 22, 290, b, 3, 'solid', true), R(608, 140, 22, 290, b, 3, 'solid', true), L(352, 250, 608, 250, r, 6), C(455, 360, 50, 50, g, 4, true), LD(480, 250, 550, 110, '簡易土留め・水圧切梁確認', r)],
      gabion_slope: [L(160, 420, 340, 420, c, 4), L(340, 420, 660, 140, c, 4), L(660, 140, 820, 140, c, 4), R(340, 340, 140, 80, b, 3, 'solid', true), R(420, 260, 140, 80, b, 3, 'solid', true), R(500, 180, 140, 80, b, 3, 'solid', true), LD(490, 260, 240, 170, '布団かご多段積・吸出し防止材', r)],
      permeable_pave: [R(220, 170, 520, 50, r, 3, 'solid', true), R(220, 220, 520, 35, g, 3), R(220, 255, 520, 105, b, 3), H(220, 360, 520, 75, 'gravel', gy), LD(740, 195, 790, 130, '透水性ブロック t=60', r), LD(740, 305, 790, 305, '単粒度砕石路盤', b)],
      temp_enclosure: [L(160, 430, 800, 430, c, 5, 'fence_x'), R(450, 150, 35, 280, b, 4, 'solid', true), L(450, 210, 310, 430, r, 4), R(275, 395, 75, 35, gy, 3, 'solid', true), LD(380, 320, 190, 230, '仮囲い控え支柱・ウエイト', r)],
      wellpoint_drain: [R(180, 260, 130, 160, b, 4, 'solid', true), L(245, 340, 245, 160, b, 5), L(245, 160, 520, 160, b, 5, 'solid', 'none', 'filled'), R(520, 140, 260, 160, g, 4, 'solid', true), T(205, 445, '釜場ポンプ', b, 20), T(565, 225, 'ノッチタンク濁水処理', g, 20)],
      traverse_survey: [L(200, 380, 440, 140, b, 4), L(440, 140, 760, 220, b, 4), L(760, 220, 620, 430, b, 4), C(188, 368, 24, 24, r), C(428, 128, 24, 24, r), C(748, 208, 24, 24, r), C(608, 418, 24, 24, r), T(155, 415, 'T.1', r, 22), T(425, 115, 'T.2', r, 22), T(775, 220, 'T.3', r, 22), T(635, 445, 'T.4', r, 22)],
      safety_passage: [L(140, 200, 820, 200, c, 4, 'fence_x'), L(140, 360, 820, 360, c, 4, 'fence_x'), L(180, 280, 780, 280, g, 5, 'arrow_flow', 'none', 'filled'), T(360, 255, '歩行者安全通路（幅1.2m以上）', g, 22)],
      soil_compaction: [R(200, 350, 560, 70, gy, 3, 'solid', true), R(200, 280, 560, 70, g, 3, 'solid', true), R(200, 210, 560, 70, b, 3, 'solid', true), D(165, 210, 165, 280, '1層 300mm', r), LD(620, 245, 700, 130, '振動ローラー転圧 6回確認', r)],

      // ⑤ 追加拡張 20種（No.101〜No.120）
      beam_diag_rebar: [R(180, 130, 600, 300, c, 4), C(420, 220, 120, 120, b, 4, true), L(350, 280, 480, 150, r, 4), L(480, 150, 610, 280, r, 4), L(350, 280, 480, 410, r, 4), L(480, 410, 610, 280, r, 4), LD(555, 205, 680, 120, 'ダイヤ斜め補強筋 4-D13', r)],
      foundation_insul: [R(260, 130, 120, 310, c, 4), R(380, 340, 340, 100, c, 4), H(380, 150, 45, 190, 'insulation', '#38bdf8'), LD(425, 230, 550, 160, '基礎内断熱材 t=50', b)],
      steel_web_hole: [R(180, 140, 600, 280, c, 4), C(410, 210, 140, 140, b, 4, true), C(392, 192, 176, 176, r, 4, false), L(392, 280, 568, 280, r, 3, 'weld_fillet'), LD(550, 210, 670, 130, '補強リング全周隅肉溶接', r)],
      stair_landing_rebar: [L(160, 420, 320, 420, c, 4), L(320, 420, 320, 340, c, 4), L(320, 340, 460, 340, c, 4), L(460, 340, 760, 340, c, 4), L(180, 445, 470, 365, r, 4), L(470, 365, 740, 365, r, 4), LD(580, 365, 650, 240, '踊り場主筋定着長さ確認', r)],
      cb_wall_rebar: [R(390, 110, 120, 260, c, 4), H(394, 114, 112, 252, 'brick', gy), R(280, 370, 340, 80, c, 4), L(450, 120, 450, 430, r, 4.5), LD(450, 220, 580, 150, 'CB縦筋 D13@400 基礎定着', r)],
      roof_drain_detail: [R(180, 310, 600, 110, c, 4), R(420, 310, 120, 75, b, 4, 'solid', true), L(180, 298, 420, 310, g, 5), L(540, 310, 780, 298, g, 5), LD(480, 350, 630, 210, 'ルーフドレン・増張り防水', r)],
      entrance_sill: [R(220, 320, 520, 110, c, 4), R(420, 275, 120, 45, b, 4, 'solid', true), L(410, 320, 550, 320, r, 5), LD(480, 275, 610, 180, 'SUS沓摺り・下枠モルタル充填', r)],
      eave_vent: [L(180, 200, 620, 310, c, 5), R(240, 310, 380, 24, H(240,310,380,24,'wood',gy).color, 3), R(360, 310, 140, 24, r, 4, 'solid', true), LD(430, 334, 540, 420, '軒天有孔換気金物・防火仕様', r)],
      floor_trim: [R(180, 310, 600, 110, c, 4), R(180, 285, 290, 25, b, 3, 'solid', true), R(490, 290, 290, 20, g, 3, 'solid', true), R(470, 282, 20, 28, r, 3, 'solid', true), LD(480, 282, 560, 190, 'アルミ見切り材・段差解消', r)],
      siding_vent: [R(260, 110, 110, 340, c, 4), H(264, 114, 102, 332, 'wood', gy), R(370, 110, 24, 340, g, 2), R(394, 110, 36, 340, b, 4, 'solid', true), L(370, 450, 455, 465, r, 4), LD(382, 240, 510, 170, '通気胴縁 t=15・土台水切り', r)],
      water_meter_box: [L(140, 220, 820, 220, c, 4, 'earth_ground'), R(360, 220, 240, 140, b, 4, 'solid', true), L(160, 330, 360, 330, b, 5, 'pipe_water'), L(600, 330, 800, 330, b, 5, 'pipe_water'), T(410, 295, '水道メーターBOX', b, 22)],
      drain_air_valve: [L(320, 140, 320, 450, r, 6, 'pipe_drain'), L(320, 280, 680, 300, r, 5, 'pipe_drain'), R(298, 95, 44, 45, b, 4, 'solid', true), LD(342, 115, 480, 115, '通気弁（ドルゴ）・封水保護', b)],
      temp_power_panel: [R(320, 120, 320, 260, c, 4), R(360, 160, 100, 70, r, 3, 'solid', true), R(500, 160, 100, 70, b, 3, 'solid', true), L(480, 380, 480, 470, g, 5, 'elec_wire'), T(370, 200, '主幹ELB', r, 18), T(510, 200, '分岐MCCB', b, 18)],
      ceiling_light_cut: [R(220, 130, 520, 300, c, 4), L(220, 220, 740, 220, b, 3, 'dashed'), L(220, 340, 740, 340, b, 3, 'dashed'), C(445, 245, 70, 70, r, 4, true), LD(515, 280, 620, 175, 'DL開口 φ150（野縁離隔確認）', r)],
      outdoor_pipe_rack: [R(200, 220, 560, 65, b, 4, 'solid', true), L(300, 285, 300, 420, c, 5), L(660, 285, 660, 420, c, 5), L(160, 420, 800, 420, c, 4, 'earth_ground'), LD(480, 220, 580, 135, '保温＋鋼板ラッキング仕上げ', r)],
      steel_plate_ramp: [L(120, 360, 340, 360, c, 4), L(340, 360, 460, 280, c, 4), L(460, 280, 840, 280, c, 4), L(320, 352, 470, 272, r, 7), LD(400, 305, 520, 180, '敷鉄板 t=22 乗り入れ養生', r)],
      catch_basin_detail: [R(340, 150, 280, 290, c, 4), L(150, 260, 340, 270, b, 5), L(620, 290, 810, 300, b, 5), R(340, 135, 280, 15, g, 4), D(645, 300, 645, 440, '泥溜 150', r)],
      heavy_machinery_zone: [R(410, 230, 140, 100, '#f59e0b', 4, 'solid', true), C(280, 80, 400, 400, r, 3.5, false), R(220, 50, 520, 460, r, 3, 'fence_x'), T(340, 115, '旋回作業半径・立入禁止', r, 22)],
      boundary_stake: [R(445, 220, 70, 110, c, 4, 'solid', true), L(480, 275, 220, 150, b, 3, 'dashed'), L(480, 275, 740, 160, b, 3, 'dashed'), T(435, 360, '境界標 No.4', r, 22), T(180, 135, '引照点K1 (L=3.42m)', b, 20), T(650, 145, '引照点K2 (L=4.15m)', b, 20)],
      weep_hole_filter: [R(260, 110, 100, 350, c, 4), H(360, 140, 150, 320, 'gravel', gy), L(240, 340, 420, 325, b, 6), R(420, 295, 35, 65, g, 3, 'solid', true), LD(438, 295, 560, 195, '吸出し防止マット＋砕石フィルタ', r)]
    };

    if (Array.isArray(map[key])) {
      return map[key];
    }
    const meta = PRESETS_120.find(item => item.key === key);
    const label = meta ? meta.name.replace(/^[^\s]+\s*\d+\.\s*/, '') : key;
    return [
      R(240, 140, 480, 280, c, 4),
      LD(480, 280, 660, 140, label || '施工確認箇所', r)
    ];
  }

  // ==================== 3. 3アプリ共通 Canvas 2D 高精細ベクター描画レンダラー ====================
  function hexToRgba(hex, alpha = 0.14) {
    const clean = String(hex || '#dc2626').replace('#', '');
    if (clean.length !== 6) return `rgba(220,38,38,${alpha})`;
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function getDashArrayForObject(obj, sw) {
    if (obj.dashPattern && obj.dashPattern !== 'none') {
      const found = (STYLE_DEFS.dashPatterns || []).find(d => d.id === obj.dashPattern);
      if (found && Array.isArray(found.mult)) return found.mult.map(m => m * sw);
    }
    if (obj.lineStyle === 'dashed') return [sw * 3.5, sw * 2.2];
    if (obj.lineStyle === 'dashdot') return [sw * 5.5, sw * 1.6, sw * 0.8, sw * 1.6];
    if (obj.lineStyle === 'dashdot2') return [sw * 5.5, sw * 1.4, sw * 0.8, sw * 1.4, sw * 0.8, sw * 1.4];
    return [];
  }

  function getArrowTrimOffset(type, sw) {
    if (!type || type === 'none' || type === 'arch_tick' || type === 'bar') return 0;
    const s = Math.max(11, sw * 3.2);
    if (type === 'filled') return s * 0.65;
    if (type === 'open') return s * 0.95;
    if (type === 'stealth') return s * 0.72;
    if (type === 'harpoon') return s * 0.75;
    if (type === 'double_arrow') return s * 1.1;
    if (type === 'open_circle') return s * 0.38;
    if (type === 'circle') return s * 0.2;
    if (type === 'square') return s * 0.25;
    if (type === 'diamond') return s * 0.3;
    if (type === 'sharp') return Math.max(3, sw * 0.7);
    return 0;
  }

  function drawArrowMarker(ctx, type, x, y, ang, col, sw) {
    if (!type || type === 'none') return;
    const s = Math.max(11, sw * 3.2);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(ang);
    ctx.strokeStyle = col;
    ctx.fillStyle = col;
    ctx.lineWidth = Math.max(1.8, sw * 0.85);
    ctx.setLineDash([]);

    if (type === 'filled') {
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-s, -s * 0.48); ctx.lineTo(-s, s * 0.48); ctx.closePath(); ctx.fill();
    } else if (type === 'open') {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-s, -s * 0.48); ctx.lineTo(-s, s * 0.48); ctx.closePath(); ctx.fill(); ctx.stroke();
    } else if (type === 'sharp') {
      ctx.beginPath(); ctx.moveTo(-s * 0.9, -s * 0.48); ctx.lineTo(0, 0); ctx.lineTo(-s * 0.9, s * 0.48); ctx.stroke();
    } else if (type === 'stealth') {
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-s * 1.1, -s * 0.48); ctx.lineTo(-s * 0.75, 0); ctx.lineTo(-s * 1.1, s * 0.48); ctx.closePath(); ctx.fill();
    } else if (type === 'harpoon') {
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-s, -s * 0.48); ctx.lineTo(-s * 0.75, 0); ctx.closePath(); ctx.fill();
    } else if (type === 'double_arrow') {
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-s * 0.75, -s * 0.45); ctx.lineTo(-s * 0.75, s * 0.45); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-s * 0.55, 0); ctx.lineTo(-s * 1.3, -s * 0.45); ctx.lineTo(-s * 1.3, s * 0.45); ctx.closePath(); ctx.fill();
    } else if (type === 'circle') {
      ctx.beginPath(); ctx.arc(0, 0, s * 0.36, 0, Math.PI * 2); ctx.fill();
    } else if (type === 'open_circle') {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(0, 0, s * 0.38, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    } else if (type === 'square') {
      ctx.fillRect(-s * 0.35, -s * 0.35, s * 0.7, s * 0.7);
    } else if (type === 'diamond') {
      ctx.beginPath(); ctx.moveTo(s * 0.45, 0); ctx.lineTo(0, -s * 0.45); ctx.lineTo(-s * 0.45, 0); ctx.lineTo(0, s * 0.45); ctx.closePath(); ctx.fill();
    } else if (type === 'arch_tick') {
      ctx.beginPath(); ctx.moveTo(-s * 0.45, s * 0.55); ctx.lineTo(s * 0.45, -s * 0.55); ctx.stroke();
    } else if (type === 'bar') {
      ctx.beginPath(); ctx.moveTo(0, -s * 0.65); ctx.lineTo(0, s * 0.65); ctx.stroke();
    }
    ctx.restore();
  }

  function drawStyledSegment(ctx, x1, y1, x2, y2, obj) {
    const col = obj.color || '#dc2626';
    const sw = obj.strokeWidth || 3.5;
    const ls = obj.lineStyle || 'solid';
    const ang = Math.atan2(y2 - y1, x2 - x1);
    const len = Math.hypot(x2 - x1, y2 - y1);
    if (len < 1) return;

    const ux = Math.cos(ang);
    const uy = Math.sin(ang);
    const nx = -uy;
    const ny = ux;
    ctx.strokeStyle = col;
    ctx.fillStyle = col;
    ctx.lineWidth = sw;
    ctx.setLineDash(getDashArrayForObject(obj, sw));

    if (ls === 'double') {
      const g = Math.max(3, sw * 1.1);
      ctx.lineWidth = Math.max(1.5, sw * 0.65);
      ctx.beginPath(); ctx.moveTo(x1 + nx * g, y1 + ny * g); ctx.lineTo(x2 + nx * g, y2 + ny * g); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x1 - nx * g, y1 - ny * g); ctx.lineTo(x2 - nx * g, y2 - ny * g); ctx.stroke();
    } else if (ls === 'triple') {
      const g = Math.max(4, sw * 1.3);
      ctx.lineWidth = Math.max(1.3, sw * 0.55);
      for (const m of [-1, 0, 1]) {
        ctx.beginPath(); ctx.moveTo(x1 + nx * g * m, y1 + ny * g * m); ctx.lineTo(x2 + nx * g * m, y2 + ny * g * m); ctx.stroke();
      }
    } else if (ls === 'thick_thin') {
      const g = Math.max(3.5, sw * 1.2);
      ctx.lineWidth = sw * 1.2;
      ctx.beginPath(); ctx.moveTo(x1 + nx * g, y1 + ny * g); ctx.lineTo(x2 + nx * g, y2 + ny * g); ctx.stroke();
      ctx.lineWidth = Math.max(1.2, sw * 0.45);
      ctx.beginPath(); ctx.moveTo(x1 - nx * g, y1 - ny * g); ctx.lineTo(x2 - nx * g, y2 - ny * g); ctx.stroke();
    } else if (ls === 'rail') {
      const g = Math.max(3, sw);
      ctx.lineWidth = Math.max(1.4, sw * 0.6);
      ctx.beginPath(); ctx.moveTo(x1 + nx * g, y1 + ny * g); ctx.lineTo(x2 + nx * g, y2 + ny * g); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x1 - nx * g, y1 - ny * g); ctx.lineTo(x2 - nx * g, y2 - ny * g); ctx.stroke();
      ctx.setLineDash([]);
      for (let d = 10; d < len - 6; d += 14) {
        const px = x1 + ux * d;
        const py = y1 + uy * d;
        ctx.beginPath(); ctx.moveTo(px + nx * (g + 2), py + ny * (g + 2)); ctx.lineTo(px - nx * (g + 2), py - ny * (g + 2)); ctx.stroke();
      }
    } else if (ls === 'wavy' || ls === 'zigzag' || ls === 'scallop') {
      const step = 14;
      const amp = Math.max(4, sw * 1.5);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      const steps = Math.max(1, Math.floor(len / step));
      for (let i = 0; i < steps; i++) {
        const t1 = (i + 0.5) / steps;
        const t2 = (i + 1) / steps;
        const mx = x1 + (x2 - x1) * t1;
        const my = y1 + (y2 - y1) * t1;
        const ex = x1 + (x2 - x1) * t2;
        const ey = y1 + (y2 - y1) * t2;
        const side = ls === 'scallop' ? 1 : (i % 2 === 0 ? 1 : -1);
        if (ls === 'zigzag') {
          ctx.lineTo(mx + nx * amp * side, my + ny * amp * side);
          ctx.lineTo(ex, ey);
        } else {
          ctx.quadraticCurveTo(mx + nx * amp * 1.4 * side, my + ny * amp * 1.4 * side, ex, ey);
        }
      }
      ctx.stroke();
    } else if (ls === 'pipe_water' || ls === 'pipe_drain') {
      const tag = ls === 'pipe_water' ? 'W' : 'D';
      if (ls === 'pipe_drain' && (!obj.dashPattern || obj.dashPattern === 'none')) {
        ctx.setLineDash([sw * 3.5, sw * 2.2]);
      }
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = `bold ${Math.max(11, Math.round(sw * 3.2))}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let d = 34; d < len - 24; d += 68) {
        const px = x1 + ux * d;
        const py = y1 + uy * d;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(px - 8, py - 8, 16, 16);
        ctx.fillStyle = col;
        ctx.fillText(tag, px, py + 1);
      }
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
    } else if (ls === 'elec_wire') {
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.setLineDash([]);
      const h = Math.max(6, sw * 1.8);
      for (let d = 30; d < len - 22; d += 64) {
        const px = x1 + ux * d;
        const py = y1 + uy * d;
        ctx.beginPath();
        ctx.moveTo(px - ux * 5 - nx * h, py - uy * 5 - ny * h);
        ctx.lineTo(px + nx * 2, py + ny * 2);
        ctx.lineTo(px - nx * 2, py - ny * 2);
        ctx.lineTo(px + ux * 5 + nx * h, py + uy * 5 + ny * h);
        ctx.stroke();
      }
    } else if (ls === 'weld_fillet') {
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.setLineDash([]);
      const sz = Math.max(7, sw * 2.1);
      for (let d = 14; d < len - 10; d += 22) {
        const px = x1 + ux * d;
        const py = y1 + uy * d;
        ctx.beginPath();
        ctx.moveTo(px - ux * sz * 0.5, py - uy * sz * 0.5);
        ctx.lineTo(px + ux * sz * 0.5, py + uy * sz * 0.5);
        ctx.lineTo(px - nx * sz, py - ny * sz);
        ctx.closePath();
        ctx.fill();
      }
    } else if (ls === 'earth_ground') {
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.setLineDash([]);
      for (let d = 16; d < len - 12; d += 36) {
        const px = x1 + ux * d;
        const py = y1 + uy * d;
        for (let k = 0; k < 3; k++) {
          const ox = px + ux * (k - 1) * 5;
          const oy = py + uy * (k - 1) * 5;
          ctx.beginPath();
          ctx.moveTo(ox, oy);
          ctx.lineTo(ox + (nx - ux * 0.5) * 9, oy + (ny - uy * 0.5) * 9);
          ctx.stroke();
        }
      }
    } else if (ls === 'fence_x') {
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.setLineDash([]);
      const r = Math.max(5, sw * 1.4);
      for (let d = 18; d < len - 14; d += 36) {
        const px = x1 + ux * d;
        const py = y1 + uy * d;
        ctx.beginPath();
        ctx.moveTo(px - r, py - r); ctx.lineTo(px + r, py + r);
        ctx.moveTo(px + r, py - r); ctx.lineTo(px - r, py + r);
        ctx.stroke();
      }
    } else if (ls === 'arrow_flow') {
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.setLineDash([]);
      for (let d = 28; d < len - 18; d += 56) {
        drawArrowMarker(ctx, 'filled', x1 + ux * d, y1 + uy * d, ang, col, Math.max(2.5, sw * 0.8));
      }
    } else {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    ctx.setLineDash([]);
  }

  function drawHatchArea(ctx, o) {
    const col = o.color || '#dc2626';
    const pat = o.hatchPattern || 'diag45';
    const x = o.x, y = o.y, w = o.w, h = o.h;
    ctx.save();
    ctx.fillStyle = hexToRgba(col, 0.08);
    ctx.fillRect(x, y, w, h);
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
    ctx.strokeStyle = col;
    ctx.fillStyle = col;
    ctx.lineWidth = 1.6;
    const sp = 14;

    if (pat === 'diag45' || pat === 'cross') {
      for (let d = -h; d < w + h; d += sp) {
        ctx.beginPath(); ctx.moveTo(x + d, y + h); ctx.lineTo(x + d + h, y); ctx.stroke();
      }
    }
    if (pat === 'diag135' || pat === 'cross') {
      for (let d = -h; d < w + h; d += sp) {
        ctx.beginPath(); ctx.moveTo(x + d, y); ctx.lineTo(x + d + h, y + h); ctx.stroke();
      }
    }
    if (pat === 'grid' || pat === 'horiz') {
      for (let gy = y; gy <= y + h; gy += sp) {
        ctx.beginPath(); ctx.moveTo(x, gy); ctx.lineTo(x + w, gy); ctx.stroke();
      }
    }
    if (pat === 'grid' || pat === 'vert') {
      for (let gx = x; gx <= x + w; gx += sp) {
        ctx.beginPath(); ctx.moveTo(gx, y); ctx.lineTo(gx, y + h); ctx.stroke();
      }
    }
    if (pat === 'dots' || pat === 'concrete') {
      for (let gx = x + 7; gx < x + w; gx += sp) {
        for (let gy = y + 7; gy < y + h; gy += sp) {
          ctx.beginPath(); ctx.arc(gx, gy, 1.6, 0, Math.PI * 2); ctx.fill();
          if (pat === 'concrete' && (Math.round(gx + gy) % 28 === 0)) {
            ctx.beginPath(); ctx.moveTo(gx + 3, gy - 3); ctx.lineTo(gx + 8, gy + 2); ctx.lineTo(gx + 2, gy + 4); ctx.closePath(); ctx.stroke();
          }
        }
      }
    }
    if (pat === 'brick') {
      let row = 0;
      for (let gy = y; gy <= y + h; gy += sp) {
        ctx.beginPath(); ctx.moveTo(x, gy); ctx.lineTo(x + w, gy); ctx.stroke();
        const offset = (row % 2) * sp;
        for (let gx = x + offset; gx <= x + w; gx += sp * 2) {
          ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx, gy + sp); ctx.stroke();
        }
        row++;
      }
    }
    if (pat === 'insulation') {
      for (let gy = y + 10; gy < y + h; gy += 22) {
        ctx.beginPath();
        ctx.moveTo(x, gy);
        for (let gx = x; gx <= x + w; gx += 12) {
          ctx.lineTo(gx + 6, gy - 7);
          ctx.lineTo(gx + 12, gy + 7);
        }
        ctx.stroke();
      }
    }
    if (pat === 'gravel') {
      for (let gx = x + 6; gx < x + w; gx += 18) {
        for (let gy = y + 6; gy < y + h; gy += 16) {
          ctx.beginPath();
          ctx.moveTo(gx, gy);
          ctx.lineTo(gx + 8, gy + 3);
          ctx.lineTo(gx + 3, gy + 9);
          ctx.closePath();
          ctx.stroke();
        }
      }
    }
    if (pat === 'wood') {
      for (let gy = y + 7; gy < y + h; gy += 11) {
        ctx.beginPath();
        ctx.moveTo(x, gy);
        for (let gx = x; gx <= x + w; gx += 32) {
          ctx.quadraticCurveTo(gx + 16, gy - 4, gx + 32, gy);
        }
        ctx.stroke();
      }
    }
    ctx.restore();
    ctx.strokeStyle = col;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);
  }

  // ==================== 4. 3アプリ共通グローバルオブジェクト公開 ====================
  global.GenbaMamezuShared = {
    VERSION: '2026.11.23-shared-v1',
    BRIDGE_STORAGE_KEY: 'genba_shared_mamezu_bridge_v1',
    STYLE_DEFS,
    PRESETS: PRESETS_120,
    getPresetCounts: getMamezuPresetCounts,
    buildPresetObjects: buildPresetObjects120,
    Renderer: {
      hexToRgba,
      getDashArrayForObject,
      getArrowTrimOffset,
      drawArrowMarker,
      drawStyledSegment,
      drawHatchArea
    }
  };

  // 後方互換エイリアス（mamezu_app.html / 他システム向け）
  global.MAMEZU_STYLE_DEFS = STYLE_DEFS;
  global.MAMEZU_PRESETS_120 = PRESETS_120;
  global.MAMEZU_PRESETS_100 = PRESETS_120;
  global.getMamezuPresetCounts = getMamezuPresetCounts;
  global.buildPresetObjects100 = buildPresetObjects120;
  global.buildPresetObjects120 = buildPresetObjects120;
})(typeof window !== 'undefined' ? window : globalThis);