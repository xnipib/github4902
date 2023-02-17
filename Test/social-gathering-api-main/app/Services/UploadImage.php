<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManagerStatic;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class UploadImage
{
    /**
     * Allowed File Extentions array
     *
     * @var array
     */
    protected $allowedFileExtentions = [
        'png',
        'jpg',
        'jpeg',
        'gif',
    ];

    public function upload($file, $bucket, $folder)
    {
        abort_if(!$this->isAllowedFile($file), 400, 'Not allowed image type');

        $name = Str::random(32) . '.' . $file->getClientOriginalExtension();

        Storage::disk('s3')->put(
            $this->buildFilePath($name, $folder),
            file_get_contents($file->getRealPath())
        );

        if ($this->isImageExists($name, $folder)) {
            return $this->buildAbsoluteFilePath($name, $bucket, $folder);
        }
    }

    public function uploadBase64($file, $bucket, $folder)
    {
        $image = ImageManagerStatic::make($file)->stream()->__toString();
        $name = Str::random(32) . '.jpg';

        Storage::disk('s3')->put(
            $this->buildFilePath($name, $folder),
            $image
        );

        if ($this->isImageExists($name, $folder)) {
            return $this->buildAbsoluteFilePath($name, $bucket, $folder);
        }
        return null;
    }

    /**
     * Check if file extention is allowed.
     *
     * @param \Symfony\Component\HttpFoundation\File\UploadedFile $file
     *
     * @return bool
     */
    protected function isAllowedFile(UploadedFile $file): bool
    {
        return in_array(
            strtolower($file->getClientOriginalExtension()),
            $this->allowedFileExtentions
        );
    }

    /**
     * Return S3 bucket file path
     *
     * @param string $name
     *
     * @return string
     */
    protected function buildFilePath($name, $folder)
    {
        return $folder . '/' . $name;
    }

    /**
     * Check if the file Exists in the S3 bucket
     *
     * @param string $name
     *
     * @return bool
     */
    protected function isImageExists($name, $folder): bool
    {
        return Storage::disk('s3')
            ->exists($this->buildFilePath($name, $folder));
    }

    /**
     * Build and return the abusolute image path
     *
     * @param string $name
     *
     * @return string Url Of Uploaded Image
     */
    protected function buildAbsoluteFilePath($name, $bucket, $folder)
    {
        //fomites-incisions-images.s3.us-west-1.amazonaws.com
        $region = config('filesystems.disks.s3.region');

        return "https://s3-{$region}.amazonaws.com/{$bucket}/{$this->buildFilePath($name,$folder)}";
    }
}
