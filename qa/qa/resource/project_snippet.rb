# frozen_string_literal: true

module QA
  module Resource
    class ProjectSnippet < Snippet
      attribute :project do
        Project.fabricate_via_api! do |resource|
          resource.name = 'project-with-snippets'
        end
      end

      def fabricate!
        project.visit!

        Page::Project::Menu.perform { |sidebar| sidebar.click_snippets }

        Page::Project::Snippet::New.perform do |new_snippet|
          new_snippet.click_create_first_snippet
          new_snippet.fill_title(@title)
          new_snippet.fill_description(@description)
          new_snippet.set_visibility(@visibility)
          new_snippet.fill_file_name(@file_name)
          new_snippet.fill_file_content(@file_content)

          @files.each.with_index(2) do |file, i|
            new_snippet.click_add_file
            new_snippet.fill_file_name(file[:name], i)
            new_snippet.fill_file_content(file[:content], i)
          end

          new_snippet.click_create_snippet_button
        end
      end
    end
  end
end
