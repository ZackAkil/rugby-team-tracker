from google.cloud.video import transcoder
from google.protobuf.duration_pb2 import Duration

parent_location ='projects/12345678910/locations/europe-west1'
transcoder_client = transcoder.TranscoderServiceClient()


def create_trim_video_job(input_url, output_folder, output_file_name, start_time_seconds, end_time_seconds):

    # create job configuration     
    job_config = transcoder.JobConfig()
    
    # get video stream     
    elementary_video_stream = transcoder.ElementaryStream()
    elementary_video_stream.key = 'video1'
    elementary_video_stream.video_stream = transcoder.VideoStream(frame_rate=30, bitrate_bps=1_500_000)

    
    # get audio stream     
    elementary_audio_stream = transcoder.ElementaryStream()
    elementary_audio_stream.key = 'audio1'
    elementary_audio_stream.audio_stream = transcoder.AudioStream(bitrate_bps=64_000)
    
    # include video and audio streams     
    job_config.elementary_streams = [elementary_video_stream, elementary_audio_stream]
   
    # create output video + audio     
    mux_stream = transcoder.MuxStream(
        key = output_file_name,
        elementary_streams = ['video1', 'audio1']
    )
    job_config.mux_streams = [mux_stream]
    
    # create edit to trim video     
    atom_edit = transcoder.EditAtom(key = 'atom0',
                                    inputs=['input0'],
                                    start_time_offset = Duration(seconds = start_time_seconds),
                                    end_time_offset = Duration(seconds = end_time_seconds))
    job_config.edit_list = [atom_edit]
   
    # create job     
    job = transcoder.Job()
    job.input_uri = input_url
    job.output_uri = output_folder
    job.config = job_config
    
    return job


job = create_trim_video_job(input_url='gs://scary-videos/test.mp4', 
                           output_folder='gs://scary-videos-fixed/', 
                           output_file_name='test_trim33',
                           start_time_seconds = 10, 
                           end_time_seconds = 15)

job_request = transcoder.CreateJobRequest(parent = parent_location, job = job)

request = transcoder_client.create_job(job_request)