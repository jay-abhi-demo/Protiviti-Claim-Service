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

    const checks = ['Duplicate Forgery', 'PDF Edit Forgery', 'Meta Data Forgery', 'Copy Move Forgery', 'Image Edit Forgery'];
    const folders = ['Input Files', 'Image Files', 'Excel Files'];
    const metadata = {
        current_folder: req.files[0].destination,
    };

    try {
        for (const file of req.files) {
            const originalPath = file.path;

            for (const check of checks) {
                for (const folderName of folders) {
                    const destDir = path.join(file.destination, check, folderName);
                    await fs.mkdir(destDir, { recursive: true });

                    if (folderName === 'Input Files') {
                        const targetPath = path.join(destDir, file.originalname);
                        await fs.copyFile(originalPath, targetPath);
                        metadata.input_folder = destDir;
                    }

                    if (folderName === 'Excel Files') {
                        metadata.output_excel_path = destDir;
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
        const scriptPath = path.join(process.cwd(), 'scripts', 'test.py');
        const metadataJson = JSON.stringify(metadata);

        const proc = spawn(pythonExec, [scriptPath, metadataJson]);
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
