
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

export const handleClaimUpload = (req, res) => {
    const { claim_number, check } = req.query;
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
    }

    // folder structure and metadata json file
    const folders = ['Input Files', 'Image Files', 'Excel Files']
    const metadata = {
        "current_folder": req.files[0].destination
    }
    for (const file of req.files) {
        const originalPath = file.path;
        console.log(file)
        folders.forEach(folderName => {
            const dest = path.join(file.destination, folderName)
            fs.mkdirSync(dest, { recursive: true })
            if (folderName == 'Input Files') {
                const targetPath = path.join(dest, file.originalname);
                fs.copyFileSync(originalPath, targetPath);
                metadata["input_folder"] = dest;
            }
            if (['Excel Files'].includes(folderName)) {
                metadata["output_excel_path"] = dest;
            }
        })
    }
    console.log(metadata)
    // end

    // update metadata json file
    const data = JSON.stringify(metadata, null, 2);
    const config = path.join(process.cwd(), "scripts", "metadata_config.json")
    fs.writeFileSync(config, data);


    // run python code

    const pythonExec = path.join(process.cwd(), 'scripts', 'venv', 'bin', 'python');  // For Linux/macOS
    const scriptPath = path.join(process.cwd(), 'scripts', 'test.py');
    const proc = spawn(pythonExec, [scriptPath]);
    proc.stdout.on('data', (data) => {
        console.log(`stdout: ${data.toString()}`);
        res.status(200).json({
            message: 'claim registered succefully',
            claim_number,
            output: data.toString()
        });
    });

    proc.stderr.on('data', (data) => {
        console.error(`stderr: ${data.toString()}`);
        res.status(200).json({
            message: 'claim failed',
            claim_number,
            error: data.toString()
        });
    });

    proc.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });

};