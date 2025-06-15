import fs from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';

async function deleteFilesInFolder(folderPath) {
    try {
        const items = await fs.readdir(folderPath, { withFileTypes: true });
        const deletePromises = items
            .filter(item => item.isFile())
            .map(file => fs.unlink(path.join(folderPath, file.name)));
        await Promise.all(deletePromises);
    } catch (err) {
        console.error('Error during cleanup:', err);
    }
}

export const handleClaimUpload = async (req, res) => {
    const { claim_number } = req.query;

    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
    }

    const checks = ['PDF Edit Forgery', 'Meta Data Forgery', 'Copy Move Forgery', 'Image Edit Forgery', 'Duplicate Forgery'];
    const folders = ['Input Files', 'Image Files', 'Excel Files'];
    const metadata = {
    };

    try {
        for (const file of req.files) {
            const originalPath = file.path;

            for (const check of checks) {
                metadata["current_folder"] = path.resolve(req.files[0].destination, check)
                for (const folderName of folders) {
                    const destDir = path.join(file.destination, check, folderName);
                    await fs.mkdir(destDir, { recursive: true });

                    if (folderName === 'Input Files') {
                        const targetPath = path.join(destDir, file.filename);
                        await fs.copyFile(originalPath, targetPath);
                        metadata.input_folder = path.resolve(destDir);
                    }

                    if (folderName === 'Excel Files') {
                        metadata.output_excel = path.resolve(destDir);
                    }
                    if(folderName == 'Image Files') {
                        metadata.image_folder = path.resolve(destDir);
                    }
                }
            }

            // Remove the original uploaded file
            await fs.unlink(originalPath);
        }

        // Cleanup remaining files in the upload destination
        deleteFilesInFolder(path.resolve(req.files[0].destination));

        // Run Python script
        const pythonExec = path.join(process.cwd(), 'scripts', 'venv', 'bin', 'python');  // Update path for Windows if needed
        const scriptPath = path.join(process.cwd(), 'scripts', 'duplicate_code.py');

        // library path
        metadata["poppler_path"] = path.join(process.cwd(), 'scripts', 'poppler-24.02.0','Library','bin');
        const metadataJson = JSON.stringify({paths: metadata});
        const baseString = Buffer.from(metadataJson).toString('base64');
        const proc = spawn(pythonExec, [scriptPath,baseString ], {cwd: process.cwd()});
        let responded = false;

        proc.stdout.on('data', (data) => {
            if (!responded) {
                responded = true;
                console.log(`stdout: ${data.toString()}`);
                return res.status(200).json({
                    message: 'Claim registered successfully',
                    claim_number,
                    output: data.toString()
                });
            }
        });

        proc.stderr.on('data', (data) => {
            if (!responded) {
                responded = true;
                console.error(`stderr: ${data.toString()}`);
                return res.status(500).json({
                    message: 'Claim processing failed',
                    claim_number,
                    error: data.toString()
                });
            }
        });

        proc.on('close', (code) => {
            console.log(`Python process exited with code ${code}`);
        });

    } catch (error) {
        console.error('Error in handleClaimUpload:', error);
        return res.status(500).json({ error: 'Server error during claim processing' });
    }
};
