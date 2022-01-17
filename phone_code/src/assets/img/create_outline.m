clear;


png_files = dir('./images/*.png');


for i = 1:length(png_files)
    
    file_name = png_files(i).name;
    
    [X,map,alpha] = imread(file_name);

    a = alpha > 0;

    new_alpha = a*255;

    new_r =  uint8(a*195);
    new_g =  uint8(a*195);
    new_b =  uint8(a*195);

    RGBarray = [];
    RGBarray(:,:,1) = new_r;
    RGBarray(:,:,2) = new_r;
    RGBarray(:,:,3) = new_r;
    RGBarray = uint8(RGBarray);
    
    
    new_file_name = [file_name(1:end-4) '-grey.png'];

    %
    imwrite(RGBarray, new_file_name, 'png', 'Alpha', new_alpha);
    %[RGBdata, map, alpha] = imread('./imgachovies-grey.png', 'png');
    
    %break;

end





