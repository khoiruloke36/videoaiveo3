document.addEventListener('DOMContentLoaded', () => {

    const formFields = [
        { id: 'judul_scane', label: 'Judul Scene', placeholder: 'contoh: terminal bus malam', type: 'text' },
        { id: 'deskripsi_karakter_inti', label: 'Deskripsi Karakter Inti', placeholder: 'contoh: Seorang vlogger wanita muda asal Minang...', type: 'textarea' },
        { id: 'detail_suara_karakter', label: 'Detail Suara Karakter', placeholder: 'contoh: Dia berbicara dengan suara wanita muda yang hangat...', type: 'textarea' },
        { id: 'aksi_karakter', label: 'Aksi Karakter', placeholder: 'contoh: berjalan di sekitar terminal bus malam...', type: 'text' },
        { id: 'ekspresi_karakter', label: 'Ekspresi Karakter', placeholder: 'contoh: Karakter menunjukkan ekspresi kagum dan antusias...', type: 'text' },
        { id: 'latar_tempat_waktu', label: 'Latar Tempat & Waktu', placeholder: 'contoh: latar tempat: di terminal bus antar kota malam hari...', type: 'textarea' },
        { id: 'detail_visual_tambahan', label: 'Detail Visual Tambahan', type: 'group' },
        { id: 'suasana_keseluruhan', label: 'Suasana Keseluruhan', placeholder: 'contoh: Suasana sibuk, ramai, dengan kesan perjalanan malam...', type: 'text' },
        { id: 'suara_lingkungan_ambience', label: 'Suara Lingkungan/Ambience', placeholder: 'contoh: SOUND: suara mesin bus menyala...', type: 'text' },
        { id: 'dialog_karakter', label: 'Dialog Karakter', placeholder: 'contoh: DIALOG dalam Bahasa Indonesia: Karakter berkata: ...', type: 'textarea' },
        { id: 'negative_prompt', label: 'Negative Prompt', placeholder: 'contoh: Hindari: teks di layar, subtitle...', type: 'textarea' }
    ];

    const cameraMotions = {
        "Static": "Static (Statis)",
        "Zoom In": "Zoom In (Perbesar)",
        "Zoom Out": "Zoom Out (Perkecil)",
        "Pan Left": "Pan Left (Geser Kiri)",
        "Pan Right": "Pan Right (Geser Kanan)",
        "Tilt Up": "Tilt Up (Miring ke Atas)",
        "Tilt Down": "Tilt Down (Miring ke Bawah)",
        "Rotate Clockwise": "Rotate Clockwise (Putar Searah Jarum Jam)",
        "Rotate Counter-Clockwise": "Rotate Counter-Clockwise (Putar Berlawanan Jarum Jam)",
        "Dolly In": "Dolly In (Maju)",
        "Dolly Out": "Dolly Out (Mundur)",
        "Truck Left": "Truck Left (Geser ke Kiri)",
        "Truck Right": "Truck Right (Geser ke Kanan)",
        "Pedestal Up": "Pedestal Up (Naik)",
        "Pedestal Down": "Pedestal Down (Turun)",
        "3D Rotation": "3D Rotation (Rotasi 3D)"
    };

    const promptForm = document.getElementById('prompt-form');

    formFields.forEach(field => {
        const formGroup = document.createElement('div');
        formGroup.className = 'mb-3';

        const label = document.createElement('label');
        label.htmlFor = field.id;
        label.className = 'form-label';
        label.textContent = field.label;
        formGroup.appendChild(label);

        if (field.type === 'textarea') {
            const textarea = document.createElement('textarea');
            textarea.id = field.id;
            textarea.className = 'form-control';
            textarea.placeholder = field.placeholder;
            textarea.rows = 3;
            formGroup.appendChild(textarea);
        } else if (field.type === 'text') {
            const input = document.createElement('input');
            input.type = 'text';
            input.id = field.id;
            input.className = 'form-control';
            input.placeholder = field.placeholder;
            formGroup.appendChild(input);
        } else if (field.type === 'group') {
            // Special group for visual details
            const visualGroup = document.createElement('div');
            visualGroup.className = 'border p-3 rounded';
            
            // Camera motion
            const motionLabel = document.createElement('label');
            motionLabel.htmlFor = 'camera_motion';
            motionLabel.className = 'form-label';
            motionLabel.textContent = 'Gerakan Kamera';
            visualGroup.appendChild(motionLabel);
            
            const select = document.createElement('select');
            select.id = 'camera_motion';
            select.className = 'form-select mb-3';
            for (const [eng, indo] of Object.entries(cameraMotions)) {
                const option = document.createElement('option');
                option.value = eng;
                option.textContent = indo;
                select.appendChild(option);
            }
            visualGroup.appendChild(select);

            // Other fields
            const otherFields = [
                {id: 'pencahayaan', label: 'Pencahayaan', placeholder: 'natural dari lampu jalan...', type: 'text'},
                {id: 'gaya_video', label: 'Gaya Video/Art Style', placeholder: 'cinematic realistis', type: 'text'},
                {id: 'kualitas_visual', label: 'Kualitas Visual', placeholder: 'Resolusi 4K', type: 'text'},
            ];
            otherFields.forEach(f => {
                const fLabel = document.createElement('label');
                fLabel.htmlFor = f.id;
                fLabel.className = 'form-label mt-2';
                fLabel.textContent = f.label;
                visualGroup.appendChild(fLabel);

                const fInput = document.createElement('input');
                fInput.type = f.type;
                fInput.id = f.id;
                fInput.className = 'form-control';
                fInput.placeholder = f.placeholder;
                visualGroup.appendChild(fInput);
            });
            formGroup.appendChild(visualGroup);
        }
        promptForm.appendChild(formGroup);
    });

    // Generate Prompt Button
    document.getElementById('generate-prompt').addEventListener('click', () => {
        const indonesianPrompt = generateIndonesianPrompt();
        document.getElementById('output-indonesia').value = indonesianPrompt;

        const englishPrompt = translateToEnglish();
        document.getElementById('output-english').value = englishPrompt;
    });

    // Change Title Button
    document.getElementById('change-title-btn').addEventListener('click', () => {
        const newTitle = document.getElementById('change-title-input').value;
        if (newTitle) {
            document.getElementById('main-title').textContent = newTitle;
        }
    });

    // Change Style Button
    document.getElementById('change-style-btn').addEventListener('click', () => {
        const colors = document.getElementById('change-style-input').value.split(',').map(c => c.trim());
        if (colors.length >= 3) {
            const root = document.documentElement;
            root.style.setProperty('--primary-color', colors[0]);
            root.style.setProperty('--secondary-color', colors[1]);
            root.style.setProperty('--text-color', colors[1]);
            root.style.setProperty('--card-bg', colors[2]);
             root.style.setProperty('--background-color', '#f0f2f5'); // A neutral background
        } else {
            alert('Masukkan 3 warna yang dipisahkan koma (contoh: #ff0000, #000000, #ffffff)');
        }
    });

    function getInputValue(id) {
        return document.getElementById(id).value;
    }

    function generateIndonesianPrompt() {
        const data = {
            judul_scane: getInputValue('judul_scane'),
            deskripsi_karakter_inti: getInputValue('deskripsi_karakter_inti'),
            detail_suara_karakter: getInputValue('detail_suara_karakter'),
            aksi_karakter: getInputValue('aksi_karakter'),
            ekspresi_karakter: getInputValue('ekspresi_karakter'),
            latar_tempat_waktu: getInputValue('latar_tempat_waktu'),
            camera_motion: getInputValue('camera_motion'),
            pencahayaan: getInputValue('pencahayaan'),
            gaya_video: getInputValue('gaya_video'),
            kualitas_visual: getInputValue('kualitas_visual'),
            suasana_keseluruhan: getInputValue('suasana_keseluruhan'),
            suara_lingkungan_ambience: getInputValue('suara_lingkungan_ambience'),
            dialog_karakter: getInputValue('dialog_karakter'),
            negative_prompt: getInputValue('negative_prompt')
        };

        return `(Judul Scene: ${data.judul_scane})
(Deskripsi Karakter Inti: ${data.deskripsi_karakter_inti})
(Detail Suara Karakter: ${data.detail_suara_karakter})
(Aksi Karakter: ${data.aksi_karakter})
(Ekspresi Karakter: ${data.ekspresi_karakter})
(Latar Tempat & Waktu: ${data.latar_tempat_waktu})
(Gerakan Kamera: ${data.camera_motion} (${cameraMotions[data.camera_motion].split('(')[1].replace(')','')}))
(Pencahayaan: ${data.pencahayaan})
(Gaya Video/Art Style: ${data.gaya_video})
(Kualitas Visual: ${data.kualitas_visual})
(Suasana Keseluruhan: ${data.suasana_keseluruhan})
(Suara Lingkungan/Ambience: ${data.suara_lingkungan_ambience})
(Dialog Karakter: ${data.dialog_karakter})
(Negative Prompt: ${data.negative_prompt})`;
    }

     function translateToEnglish() {
        const translations = {
            "Judul Scene": "Scene Title",
            "Deskripsi Karakter Inti": "Core Character Description",
            "Detail Suara Karakter": "Character Voice Details",
            "Aksi Karakter": "Character Action",
            "Ekspresi Karakter": "Character Expression",
            "Latar Tempat & Waktu": "Setting & Time",
            "Gerakan Kamera": "Camera Movement",
            "Pencahayaan": "Lighting",
            "Gaya Video/Art Style": "Video/Art Style",
            "Kualitas Visual": "Visual Quality",
            "Suasana Keseluruhan": "Overall Atmosphere",
            "Suara Lingkungan/Ambience": "Environmental Sound/Ambience",
            "Dialog Karakter": "Character Dialogue",
            "Negative Prompt": "Negative Prompt"
        };

        const data = {
            "Scene Title": getInputValue('judul_scane'),
            "Core Character Description": getInputValue('deskripsi_karakter_inti'),
            "Character Voice Details": getInputValue('detail_suara_karakter'),
            "Character Action": getInputValue('aksi_karakter'),
            "Character Expression": getInputValue('ekspresi_karakter'),
            "Setting & Time": getInputValue('latar_tempat_waktu'),
            "Camera Movement": getInputValue('camera_motion'),
            "Lighting": getInputValue('pencahayaan'),
            "Video/Art Style": getInputValue('gaya_video'),
            "Visual Quality": getInputValue('kualitas_visual'),
            "Overall Atmosphere": getInputValue('suasana_keseluruhan'),
            "Environmental Sound/Ambience": getInputValue('suara_lingkungan_ambience'),
            "Character Dialogue": getInputValue('dialog_karakter'), // This will be handled specially
            "Negative Prompt": getInputValue('negative_prompt')
        };

        let prompt = "";
        for (const [eng, value] of Object.entries(data)) {
            if (eng === "Character Dialogue") {
                // The only part that stays in Indonesian
                prompt += `(Character Dialogue: ${value})\n`;
            } else {
                prompt += `(${eng}: ${value})\n`;
            }
        }
        
        // Final prompt polishing
        // Develop the prompt to be more detailed and well-phrased
        const finalPrompt = `A high-quality, 4K cinematic video.
Scene: ${data['Scene Title']}.
The scene is set at/in ${data['Setting & Time']}.
The main character is a ${data['Core Character Description']}.
Their voice is ${data['Character Voice Details']}.
Action: The character is ${data['Character Action']} with an expression of ${data['Character Expression']}.
The overall atmosphere is ${data['Overall Atmosphere']}.
Camera follows the character with a ${data['Camera Movement']} shot, lit by ${data['Lighting']}. The art style is ${data['Video/Art Style']}.
Sound design: The ambient sound consists of ${data['Environmental Sound/Ambience']}.
Dialogue (in Indonesian): "${data['Character Dialogue']}".
Negative prompt: Avoid ${data['Negative Prompt']}.`;

        return finalPrompt.replace(/\n\s*\n/g, '\n'); // remove extra blank lines
    }
}); 